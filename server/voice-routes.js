// ============================================================
// Namma Ooru Express — AI Voice Call Ordering API Routes
// Telephony webhooks + AI tool endpoints
// ============================================================

const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// In-memory active calls store (in production, use Redis)
const activeCalls = new Map();

// ─── CONFIGURATION ───────────────────────────────────────────

const VOICE_CONFIG = {
  confidenceThreshold: 70,
  maxClarificationAttempts: 2,
  maxCallDuration: 300,
  highValueOrderThreshold: 2000,
  recordingRetentionDays: 90,
  concurrentCallLimit: 10,
};

// Rate limiting per phone number (anti-fraud)
const callRateLimit = new Map(); // phone → { count, lastReset }
const RATE_LIMIT_MAX = 10; // max 10 calls per hour per number
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(phone) {
  const now = Date.now();
  const entry = callRateLimit.get(phone);
  if (!entry || now - entry.lastReset > RATE_LIMIT_WINDOW) {
    callRateLimit.set(phone, { count: 1, lastReset: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// ─── TELEPHONY WEBHOOKS ──────────────────────────────────────

/**
 * POST /api/voice/incoming-call
 * Webhook: Telephony provider sends this when a call comes in
 * Compatible with Exotel/Knowlarity/Twilio-style payloads
 */
router.post('/incoming-call', async (req, res) => {
  try {
    const { CallSid, From, To, CallStatus, StartTime, Direction } = req.body;

    console.log(`📞 Incoming call: ${CallSid} from ${From}`);

    // Rate limit check
    if (!checkRateLimit(From)) {
      console.warn(`⚠️ Rate limit exceeded for ${From}`);
      return res.status(429).json({
        success: false,
        error: 'Too many calls. Please try again later.',
        action: 'play_message', // Tell telephony to play a "try later" message
        message_ta: 'நன்றி. தயவுசெய்து சிறிது நேரம் கழித்து மீண்டும் call செய்யுங்கள்.',
      });
    }

    // Check concurrent call limit
    if (activeCalls.size >= VOICE_CONFIG.concurrentCallLimit) {
      console.warn(`⚠️ Concurrent call limit reached: ${activeCalls.size}`);
      return res.status(503).json({
        success: false,
        error: 'All lines busy',
        action: 'play_message',
        message_ta: 'நன்றி. எல்லா lines-ம் busy-ஆ இருக்கு. தயவுசெய்து 2 நிமிசம் கழித்து call செய்யுங்கள்.',
      });
    }

    // Create voice call record
    const callRecord = {
      id: `vc_${crypto.randomBytes(8).toString('hex')}`,
      callId: CallSid,
      callerPhone: From,
      startTime: StartTime || new Date().toISOString(),
      outcome: 'in_progress',
      escalatedToHuman: false,
      detectedLanguage: 'ta', // default, will update during call
      transcript: [],
      turnIndex: 0,
      partialOrder: null,
      metadata: {
        telephonyProvider: req.headers['x-provider'] || 'exotel',
        direction: Direction || 'inbound',
      },
      createdAt: new Date().toISOString(),
    };

    activeCalls.set(CallSid, callRecord);

    // Look up customer voice profile
    const voiceProfile = await getCustomerVoiceProfile(From);

    // Return response to telephony provider (connect to AI agent)
    res.json({
      success: true,
      callId: callRecord.id,
      action: 'connect_to_ai_agent',
      config: {
        systemPrompt: 'VOICE_AGENT_SYSTEM_PROMPT', // Reference to the prompt
        greeting: voiceProfile
          ? `Vanakkam ${voiceProfile.knownName || ''}! Namma Ooru Express. Enna order venum?`
          : 'Vanakkam! Namma Ooru Express-ku varaverkiren. Enna order venum?',
        language: voiceProfile?.preferredLanguage || 'ta',
        tools: ['search_shops', 'search_item', 'get_last_order', 'create_order', 'transfer_to_human', 'send_sms_confirmation'],
        callerProfile: voiceProfile || null,
      },
    });
  } catch (error) {
    console.error('❌ Incoming call error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * POST /api/voice/call-ended
 * Webhook: Telephony provider sends this when a call ends
 */
router.post('/call-ended', async (req, res) => {
  try {
    const { CallSid, From, CallStatus, Duration, RecordingUrl, EndTime } = req.body;

    console.log(`📞 Call ended: ${CallSid} | Duration: ${Duration}s | Status: ${CallStatus}`);

    const callRecord = activeCalls.get(CallSid);
    if (!callRecord) {
      return res.status(404).json({ success: false, error: 'Call not found' });
    }

    // Update call record
    callRecord.endTime = EndTime || new Date().toISOString();
    callRecord.duration = Duration || 0;
    callRecord.recordingUrl = RecordingUrl || null;

    // Determine outcome if still in_progress
    if (callRecord.outcome === 'in_progress') {
      if (CallStatus === 'completed' && !callRecord.linkedOrderId) {
        callRecord.outcome = 'no_order';
      } else if (['failed', 'busy', 'no-answer'].includes(CallStatus)) {
        callRecord.outcome = 'call_dropped';
      }
    }

    // Save to database (Firestore)
    await saveVoiceCall(callRecord);

    // Update customer voice profile
    if (callRecord.outcome === 'order_created') {
      await updateCustomerVoiceProfile(From, callRecord);
    }

    // Remove from active calls
    activeCalls.delete(CallSid);

    res.json({ success: true, callId: callRecord.id, outcome: callRecord.outcome });
  } catch (error) {
    console.error('❌ Call ended error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * POST /api/voice/transcript-turn
 * Streaming transcript ingestion — each AI/customer turn
 */
router.post('/transcript-turn', async (req, res) => {
  try {
    const { callSid, speaker, text, language, confidence } = req.body;

    const callRecord = activeCalls.get(callSid);
    if (!callRecord) {
      return res.status(404).json({ success: false, error: 'Call not found' });
    }

    const turn = {
      id: `turn_${crypto.randomBytes(4).toString('hex')}`,
      callId: callSid,
      turnIndex: callRecord.turnIndex++,
      speaker,
      text,
      timestamp: new Date().toISOString(),
      detectedLanguage: language || 'ta',
      confidence: confidence || null,
    };

    callRecord.transcript.push(turn);

    // Update detected language if customer speaks
    if (speaker === 'customer' && language) {
      callRecord.detectedLanguage = language;
    }

    res.json({ success: true, turnId: turn.id });
  } catch (error) {
    console.error('❌ Transcript turn error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ─── AI TOOL ENDPOINTS (called by voice agent via function calling) ──

/**
 * POST /api/voice/search-shops
 * Tool: search_shops(area, item_category, item_name)
 * Returns nearby shops ranked by rating + stock availability
 */
router.post('/search-shops', async (req, res) => {
  try {
    const { area, item_category, item_name } = req.body;

    console.log(`🔍 Search shops: area=${area}, category=${item_category}, item=${item_name}`);

    // Search shops from Firestore (uses existing shops collection)
    // In production, this queries Firestore with geospatial + category filters
    const shops = await searchShopsForVoice(area, item_category, item_name);

    res.json({
      success: true,
      results: shops,
      count: shops.length,
    });
  } catch (error) {
    console.error('❌ Search shops error:', error);
    res.status(500).json({ success: false, results: [], error: error.message });
  }
});

/**
 * POST /api/voice/search-item
 * Tool: search_item(shop_id, item_query)
 * Returns matching products from shop catalog
 */
router.post('/search-item', async (req, res) => {
  try {
    const { shop_id, item_query } = req.body;

    console.log(`🔍 Search item: shop=${shop_id}, query=${item_query}`);

    const items = await searchItemInShop(shop_id, item_query);

    res.json({
      success: true,
      results: items,
      count: items.length,
    });
  } catch (error) {
    console.error('❌ Search item error:', error);
    res.status(500).json({ success: false, results: [], error: error.message });
  }
});

/**
 * GET /api/voice/last-order/:phone
 * Tool: get_last_order(caller_phone)
 * Returns customer's most recent order for repeat-order
 */
router.get('/last-order/:phone', async (req, res) => {
  try {
    const { phone } = req.params;

    console.log(`📋 Get last order for: ${phone}`);

    const lastOrder = await getLastOrderByPhone(phone);

    if (!lastOrder) {
      return res.json({
        success: false,
        message: 'No previous orders found for this number',
        result: null,
      });
    }

    res.json({
      success: true,
      result: lastOrder,
    });
  } catch (error) {
    console.error('❌ Get last order error:', error);
    res.status(500).json({ success: false, result: null, error: error.message });
  }
});

/**
 * POST /api/voice/create-order
 * Tool: create_order — REUSES existing order creation logic
 * This is the critical integration point — same pipeline as app checkout
 */
router.post('/create-order', async (req, res) => {
  try {
    const { shop_id, items, customer_phone, delivery_address, customer_name, call_id } = req.body;

    console.log(`📦 Create voice order: shop=${shop_id}, items=${items.length}, phone=${customer_phone}`);

    // Validate required fields
    if (!shop_id || !items || !items.length || !customer_phone) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: shop_id, items, customer_phone',
      });
    }

    // Calculate order total
    let subtotal = 0;
    const orderItems = items.map(item => {
      const itemTotal = (item.price || 0) * item.quantity;
      subtotal += itemTotal;
      return {
        productId: item.product_id || `voice_${crypto.randomBytes(4).toString('hex')}`,
        shopId: shop_id,
        name: item.name,
        nameTamil: item.name, // AI will provide Tamil name when available
        price: item.price || 0,
        quantity: item.quantity,
        unit: item.unit,
        isVeg: true, // default, can be refined
      };
    });

    const deliveryCharge = subtotal >= 500 ? 0 : 50;
    const total = subtotal + deliveryCharge;

    // High-value order check — require SMS confirmation
    if (total > VOICE_CONFIG.highValueOrderThreshold) {
      // Send SMS confirmation link instead of placing directly
      await sendSmsConfirmation(customer_phone, {
        shopId: shop_id,
        items: orderItems,
        total,
        confirmationRequired: true,
      });
      return res.json({
        success: true,
        requiresConfirmation: true,
        message: `Order total is ₹${total}. SMS confirmation link sent to ${customer_phone}`,
      });
    }

    // ━━━━ REUSE EXISTING ORDER CREATION ━━━━
    // This calls the SAME order creation function used by checkout page
    const orderData = {
      userId: `voice_${customer_phone.replace(/\D/g, '')}`, // Voice caller as user
      shopId: shop_id,
      shopName: '', // Will be resolved from shop lookup
      shopIcon: '📞',
      items: orderItems,
      subtotal,
      deliveryCharge,
      total,
      status: 'placed',
      paymentMethod: 'cash_on_delivery',
      address: {
        id: `addr_voice_${crypto.randomBytes(4).toString('hex')}`,
        label: 'Voice Order',
        fullAddress: delivery_address || 'To be confirmed',
        lat: 0,
        lng: 0,
        pincode: '',
        city: 'Thanjavur',
      },
      notes: `📞 Voice Order | Customer: ${customer_name || 'Unknown'} | Phone: ${customer_phone}`,
      // ━━━━ NEW FIELDS for voice orders ━━━━
      orderSource: 'voice_call',
      sourceCallId: call_id || null,
      customerPhone: customer_phone,
      customerName: customer_name || null,
    };

    // Use the existing placeOrder function (same as app checkout)
    const orderId = await placeVoiceOrder(orderData);

    // Update active call record
    if (call_id && activeCalls.has(call_id)) {
      const callRecord = activeCalls.get(call_id);
      callRecord.linkedOrderId = orderId;
      callRecord.outcome = 'order_created';
    }

    // Send SMS confirmation to customer
    await sendSmsConfirmation(customer_phone, {
      orderId,
      shopName: orderData.shopName,
      items: orderItems,
      total,
      eta: '25-35 min',
    });

    res.json({
      success: true,
      orderId,
      orderTotal: total,
      estimatedDelivery: '25-35 minutes',
      message: `Order placed successfully! Total: ₹${total}`,
    });
  } catch (error) {
    console.error('❌ Create voice order error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/voice/transfer-human
 * Tool: transfer_to_human — warm handoff to human agent
 */
router.post('/transfer-human', async (req, res) => {
  try {
    const { call_id, reason, context_summary } = req.body;

    console.log(`🙋 Transfer to human: call=${call_id}, reason=${reason}`);

    const callRecord = activeCalls.get(call_id);

    // Create escalation record
    const escalation = {
      id: `esc_${crypto.randomBytes(8).toString('hex')}`,
      callId: call_id,
      reason,
      escalatedAt: new Date().toISOString(),
      status: 'queued',
      callContext: {
        transcript: callRecord?.transcript || [],
        partialOrder: callRecord?.partialOrder || null,
        customerPhone: callRecord?.callerPhone || '',
        customerName: callRecord?.customerName || null,
        contextSummary: context_summary || '',
      },
    };

    // Save escalation
    await saveHumanEscalation(escalation);

    // Update call record
    if (callRecord) {
      callRecord.escalatedToHuman = true;
      callRecord.escalationReason = reason;
      callRecord.outcome = 'escalated_to_human';
    }

    // Notify human agents (via Socket.IO)
    if (global.io) {
      global.io.to('role-admin').emit('voice-escalation', escalation);
      global.io.to('role-support').emit('voice-escalation', escalation);
    }

    res.json({
      success: true,
      escalationId: escalation.id,
      action: 'transfer_call',
      message: 'Transferring to human agent',
      // Telephony action: transfer to agent queue number
      transferTo: process.env.HUMAN_AGENT_QUEUE_NUMBER || '+919566700534',
    });
  } catch (error) {
    console.error('❌ Transfer to human error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/voice/send-sms
 * Tool: send_sms_confirmation
 */
router.post('/send-sms', async (req, res) => {
  try {
    const { customer_phone, order_summary, order_id } = req.body;

    console.log(`📱 Send SMS: phone=${customer_phone}`);

    await sendSmsConfirmation(customer_phone, {
      orderId: order_id,
      summary: order_summary,
    });

    res.json({ success: true, message: 'SMS sent' });
  } catch (error) {
    console.error('❌ Send SMS error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── ADMIN ENDPOINTS ─────────────────────────────────────────

/**
 * GET /api/admin/voice-calls
 * Admin: List all voice calls with filters
 */
router.get('/admin/calls', async (req, res) => {
  try {
    const { status, date_from, date_to, outcome, page = 1, limit = 20 } = req.query;

    const calls = await getVoiceCalls({
      outcome,
      dateFrom: date_from,
      dateTo: date_to,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      calls: calls.data,
      total: calls.total,
      page: parseInt(page),
      totalPages: Math.ceil(calls.total / parseInt(limit)),
    });
  } catch (error) {
    console.error('❌ Admin calls error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/voice-analytics
 * Admin: Voice call analytics dashboard data
 */
router.get('/admin/analytics', async (req, res) => {
  try {
    const { period = '7d' } = req.query;

    const analytics = await getVoiceAnalytics(period);

    res.json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error('❌ Admin analytics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/voice-calls/:id/transcript
 * Admin: Get full transcript for a specific call
 */
router.get('/admin/calls/:id/transcript', async (req, res) => {
  try {
    const { id } = req.params;
    const transcript = await getCallTranscript(id);

    res.json({
      success: true,
      transcript,
    });
  } catch (error) {
    console.error('❌ Get transcript error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/escalations
 * Admin: List human escalations
 */
router.get('/admin/escalations', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const escalations = await getEscalations({
      status,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      escalations: escalations.data,
      total: escalations.total,
    });
  } catch (error) {
    console.error('❌ Escalations error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── DATABASE HELPER FUNCTIONS ───────────────────────────────
// These functions interact with Firestore
// In production, replace with actual Firestore calls

async function getCustomerVoiceProfile(phone) {
  // TODO: Query Firestore 'customer_voice_profiles' collection
  // For now, return null (new customer)
  try {
    // const admin = require('firebase-admin');
    // const db = admin.firestore();
    // const snap = await db.collection('customer_voice_profiles').doc(phone).get();
    // if (snap.exists) return { phoneNumber: phone, ...snap.data() };
    return null;
  } catch (e) {
    return null;
  }
}

async function updateCustomerVoiceProfile(phone, callRecord) {
  // TODO: Update/create customer voice profile in Firestore
  try {
    // const admin = require('firebase-admin');
    // const db = admin.firestore();
    // await db.collection('customer_voice_profiles').doc(phone).set({
    //   phoneNumber: phone,
    //   lastOrderId: callRecord.linkedOrderId,
    //   preferredLanguage: callRecord.detectedLanguage,
    //   totalVoiceOrders: admin.firestore.FieldValue.increment(1),
    //   updatedAt: new Date().toISOString(),
    // }, { merge: true });
    console.log(`✅ Voice profile updated for ${phone}`);
  } catch (e) {
    console.error('Profile update error:', e);
  }
}

async function saveVoiceCall(callRecord) {
  // TODO: Save to Firestore 'voice_calls' collection
  try {
    // const admin = require('firebase-admin');
    // const db = admin.firestore();
    // await db.collection('voice_calls').doc(callRecord.id).set(callRecord);
    console.log(`✅ Voice call saved: ${callRecord.id}`);
  } catch (e) {
    console.error('Save voice call error:', e);
  }
}

async function saveHumanEscalation(escalation) {
  // TODO: Save to Firestore 'human_escalations' collection
  try {
    // const admin = require('firebase-admin');
    // const db = admin.firestore();
    // await db.collection('human_escalations').doc(escalation.id).set(escalation);
    console.log(`✅ Escalation saved: ${escalation.id}`);
  } catch (e) {
    console.error('Save escalation error:', e);
  }
}

async function searchShopsForVoice(area, itemCategory, itemName) {
  // TODO: Query Firestore 'shops' collection with filters
  // Uses existing shops data — fuzzy match on name/area
  try {
    // const admin = require('firebase-admin');
    // const db = admin.firestore();
    // let query = db.collection('shops').where('isOpen', '==', true).where('isApproved', '==', true);
    // if (itemCategory) query = query.where('categoryId', '==', itemCategory);
    // const snap = await query.orderBy('rating', 'desc').limit(5).get();
    // return snap.docs.map(d => ({ shopId: d.id, ...d.data() }));

    // Fallback: return mock data for development
    return [
      { shopId: 'shop_1', shopName: 'Murugan Stores', distance: '0.5 km', rating: 4.5, isOpen: true, hasRequestedItems: true },
      { shopId: 'shop_2', shopName: 'Sri Krishna Maligai', distance: '1.2 km', rating: 4.3, isOpen: true, hasRequestedItems: true },
    ];
  } catch (e) {
    console.error('Search shops error:', e);
    return [];
  }
}

async function searchItemInShop(shopId, itemQuery) {
  // TODO: Query Firestore 'products' collection
  // Fuzzy text search on product name within the given shop
  try {
    // const admin = require('firebase-admin');
    // const db = admin.firestore();
    // const snap = await db.collection('products')
    //   .where('shopId', '==', shopId)
    //   .where('isAvailable', '==', true)
    //   .get();
    // // Fuzzy match on item name
    // const results = snap.docs.filter(d => {
    //   const name = d.data().name.toLowerCase();
    //   return name.includes(itemQuery.toLowerCase());
    // });
    // return results.map(d => ({ productId: d.id, ...d.data() }));

    // Fallback: return mock data for development
    return [
      { productId: 'prod_1', name: 'Gold Winner Sunflower Oil', nameTamil: 'கோல்ட் வின்னர் சூரியகாந்தி எண்ணெய்', price: 180, unit: '1 litre', isAvailable: true, stockQuantity: 25 },
    ];
  } catch (e) {
    console.error('Search item error:', e);
    return [];
  }
}

async function getLastOrderByPhone(phone) {
  // TODO: Query Firestore 'orders' collection by customer phone
  try {
    // const admin = require('firebase-admin');
    // const db = admin.firestore();
    // const snap = await db.collection('orders')
    //   .where('customerPhone', '==', phone)
    //   .orderBy('createdAt', 'desc')
    //   .limit(1)
    //   .get();
    // if (snap.empty) return null;
    // const doc = snap.docs[0];
    // return { orderId: doc.id, ...doc.data() };
    return null;
  } catch (e) {
    console.error('Get last order error:', e);
    return null;
  }
}

async function placeVoiceOrder(orderData) {
  // ━━━━ CRITICAL: Reuses the SAME order creation as app checkout ━━━━
  // TODO: Use firebase-admin to write to 'orders' collection
  // This MUST use the same order structure as the checkout page
  try {
    // const admin = require('firebase-admin');
    // const db = admin.firestore();
    // const ref = await db.collection('orders').add({
    //   ...orderData,
    //   createdAt: admin.firestore.FieldValue.serverTimestamp(),
    //   updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    // });
    // return ref.id;

    // Fallback: generate mock order ID
    const orderId = `order_voice_${crypto.randomBytes(6).toString('hex')}`;
    console.log(`✅ Voice order created: ${orderId}`);
    return orderId;
  } catch (e) {
    console.error('Place voice order error:', e);
    throw new Error('Failed to create order');
  }
}

async function sendSmsConfirmation(phone, data) {
  // TODO: Integrate with SMS provider (Exotel/MSG91/Twilio)
  try {
    const message = data.summary || `Namma Ooru Express: Order #${data.orderId || 'NEW'} placed! Total: ₹${data.total || 0}. Delivery in ${data.eta || '30 min'}. Track: noe.in/t/${data.orderId || ''}`;
    console.log(`📱 SMS to ${phone}: ${message}`);
    // In production:
    // await smsProvider.send({ to: phone, message });
  } catch (e) {
    console.error('Send SMS error:', e);
  }
}

async function getVoiceCalls(filters) {
  // TODO: Query Firestore with pagination
  return { data: [], total: 0 };
}

async function getVoiceAnalytics(period) {
  // TODO: Aggregate Firestore data
  return {
    totalCalls: 0,
    successfulOrders: 0,
    escalatedCalls: 0,
    abandonedCalls: 0,
    averageHandleTime: 0,
    averageConfidenceScore: 0,
    successRate: 0,
    escalationRate: 0,
    peakHours: [],
    languageDistribution: [],
    topItems: [],
    dailyTrend: [],
  };
}

async function getCallTranscript(callId) {
  // TODO: Query Firestore
  return [];
}

async function getEscalations(filters) {
  // TODO: Query Firestore
  return { data: [], total: 0 };
}

module.exports = router;
