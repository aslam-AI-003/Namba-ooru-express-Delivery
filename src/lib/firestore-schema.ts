/**
 * Firestore Database Schema for Namma Ooru Express
 * 
 * This file documents the normalized schema with foreign-key-style references.
 * All collections use auto-generated IDs unless specified otherwise.
 */

// ============ COLLECTION: users ============
export interface UserDoc {
  uid: string; // Firebase Auth UID (document ID)
  role: 'customer' | 'vendor' | 'rider' | 'admin';
  displayName: string;
  phone: string;
  email?: string;
  photoURL?: string;
  language: 'en' | 'ta';
  addresses: Address[];
  defaultAddressIndex: number;
  walletBalance: number;
  loyaltyPoints: number;
  referralCode: string;
  referredBy?: string;
  favoriteShopIds: string[];
  fcmToken?: string;
  createdAt: FirebaseTimestamp;
  updatedAt: FirebaseTimestamp;
  isActive: boolean;
}

export interface Address {
  id: string;
  label: string; // "Home", "Office", etc.
  fullAddress: string;
  landmark?: string;
  lat: number;
  lng: number;
  pincode: string;
  city: string;
}

// ============ COLLECTION: shops ============
export interface ShopDoc {
  id: string;
  ownerId: string; // FK → users.uid
  name: string;
  nameTamil: string;
  description: string;
  categoryId: string; // FK → categories.id
  tags: string[];
  phone: string;
  email?: string;
  address: {
    full: string;
    lat: number;
    lng: number;
    pincode: string;
    city: string;
    zoneId: string; // FK → zones.id
  };
  images: {
    logo: string;
    banner: string;
    gallery: string[];
  };
  timing: {
    openTime: string; // "08:00"
    closeTime: string; // "22:00"
    days: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  };
  isOpen: boolean;
  isHolidayMode: boolean;
  minOrderAmount: number;
  deliveryRadius: number; // km
  avgPrepTime: number; // minutes
  rating: number;
  totalRatings: number;
  totalOrders: number;
  commission: number; // percentage
  kycStatus: 'pending' | 'submitted' | 'approved' | 'rejected';
  kycDocs: {
    shopLicense?: string;
    ownerAadhaar?: string;
    panCard?: string;
    gst?: string;
    fssai?: string;
  };
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: FirebaseTimestamp;
  updatedAt: FirebaseTimestamp;
}

// ============ COLLECTION: riders ============
export interface RiderDoc {
  id: string;
  userId: string; // FK → users.uid
  name: string;
  phone: string;
  email?: string;
  photo: string;
  vehicleType: 'bike' | 'cycle' | 'auto' | 'walking';
  vehicleNumber?: string;
  currentLocation: {
    lat: number;
    lng: number;
    updatedAt: FirebaseTimestamp;
  };
  isOnline: boolean;
  isAvailable: boolean; // not currently on a delivery
  zoneId: string; // FK → zones.id
  rating: number;
  totalDeliveries: number;
  totalEarnings: number;
  dailyEarnings: number;
  weeklyEarnings: number;
  kycStatus: 'pending' | 'submitted' | 'verified' | 'rejected';
  kycDocs: {
    aadhaarFront?: string;
    aadhaarBack?: string;
    drivingLicense?: string;
    vehicleRC?: string;
    photo?: string;
  };
  isApproved: boolean;
  createdAt: FirebaseTimestamp;
  updatedAt: FirebaseTimestamp;
}

// ============ COLLECTION: products ============
export interface ProductDoc {
  id: string;
  shopId: string; // FK → shops.id
  categoryId: string; // FK → categories.id
  name: string;
  nameTamil: string;
  description: string;
  images: string[];
  price: number;
  discountPrice?: number;
  unit: string; // "1 kg", "500 ml", "1 pc"
  isVeg: boolean;
  isAvailable: boolean;
  stockQuantity: number;
  tags: string[];
  rating: number;
  totalRatings: number;
  sortOrder: number;
  createdAt: FirebaseTimestamp;
  updatedAt: FirebaseTimestamp;
}

// ============ COLLECTION: categories ============
export interface CategoryDoc {
  id: string;
  name: string;
  nameTamil: string;
  icon: string; // Lucide icon name
  image: string;
  sortOrder: number;
  isActive: boolean;
}

// ============ COLLECTION: orders ============
export interface OrderDoc {
  id: string;
  orderNumber: string; // "NOE-2024-XXXXX"
  customerId: string; // FK → users.uid
  shopId: string; // FK → shops.id
  riderId?: string; // FK → riders.id
  status: OrderStatus;
  statusHistory: StatusHistoryEntry[];
  items: OrderItemDoc[];
  pricing: {
    subtotal: number;
    deliveryCharge: number;
    discount: number;
    couponId?: string;
    walletUsed: number;
    total: number;
    commission: number; // platform commission
  };
  payment: {
    method: 'upi' | 'card' | 'cod' | 'wallet' | 'netbanking';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    transactionId?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
  };
  delivery: {
    pickupAddress: Address;
    dropAddress: Address;
    distance: number; // km
    estimatedTime: number; // minutes
    actualTime?: number;
    pickupOtp: string;
    deliveryOtp: string;
  };
  rating?: {
    shopRating: number;
    riderRating: number;
    comment?: string;
  };
  notes?: string;
  createdAt: FirebaseTimestamp;
  updatedAt: FirebaseTimestamp;
}

export interface OrderItemDoc {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: FirebaseTimestamp;
  actor: string; // userId who triggered the change
  note?: string;
}

type OrderStatus = import('./order-state-machine').OrderStatus;

// ============ COLLECTION: payments ============
export interface PaymentDoc {
  id: string;
  orderId: string; // FK → orders.id
  userId: string;
  amount: number;
  method: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt: FirebaseTimestamp;
}

// ============ COLLECTION: settlements ============
export interface SettlementDoc {
  id: string;
  recipientId: string; // shop or rider ID
  recipientType: 'shop' | 'rider';
  period: { start: FirebaseTimestamp; end: FirebaseTimestamp };
  totalOrders: number;
  grossAmount: number;
  commission: number;
  netAmount: number;
  status: 'pending' | 'processed' | 'paid';
  transactionRef?: string;
  createdAt: FirebaseTimestamp;
}

// ============ COLLECTION: coupons ============
export interface CouponDoc {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'flat';
  value: number;
  minOrderAmount: number;
  maxDiscount: number;
  validFrom: FirebaseTimestamp;
  validTo: FirebaseTimestamp;
  usageLimit: number;
  usedCount: number;
  applicableShopIds: string[]; // empty = all shops
  isActive: boolean;
}

// ============ COLLECTION: wallets ============
export interface WalletTransactionDoc {
  id: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  purpose: 'order_payment' | 'refund' | 'cashback' | 'referral' | 'topup' | 'loyalty_redemption';
  referenceId?: string;
  description: string;
  balance: number; // balance after transaction
  createdAt: FirebaseTimestamp;
}

// ============ COLLECTION: ratings_reviews ============
export interface ReviewDoc {
  id: string;
  orderId: string;
  customerId: string;
  shopId: string;
  riderId?: string;
  shopRating: number;
  riderRating?: number;
  comment?: string;
  images?: string[];
  createdAt: FirebaseTimestamp;
}

// ============ COLLECTION: support_tickets ============
export interface SupportTicketDoc {
  id: string;
  userId: string;
  orderId?: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  messages: TicketMessage[];
  createdAt: FirebaseTimestamp;
  updatedAt: FirebaseTimestamp;
}

export interface TicketMessage {
  senderId: string;
  senderRole: 'customer' | 'support' | 'admin';
  message: string;
  timestamp: FirebaseTimestamp;
}

// ============ COLLECTION: zones ============
export interface ZoneDoc {
  id: string;
  name: string;
  cityId: string;
  polygon: { lat: number; lng: number }[]; // geo-boundary
  isActive: boolean;
  surgeMultiplier: number;
}

// ============ COLLECTION: cities ============
export interface CityDoc {
  id: string;
  name: string;
  nameTamil: string;
  state: string;
  isActive: boolean;
  baseDeliveryCharge: number;
  perKmCharge: number;
  peakHourSurcharge: number;
  rainSurcharge: number;
}

// ============ COLLECTION: banners ============
export interface BannerDoc {
  id: string;
  title: string;
  image: string;
  link?: string;
  position: number;
  isActive: boolean;
  validFrom: FirebaseTimestamp;
  validTo: FirebaseTimestamp;
}

// ============ COLLECTION: notifications ============
export interface NotificationDoc {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'order' | 'promo' | 'system' | 'chat';
  data?: Record<string, string>;
  isRead: boolean;
  createdAt: FirebaseTimestamp;
}

// ============ COLLECTION: audit_logs ============
export interface AuditLogDoc {
  id: string;
  actorId: string;
  actorRole: string;
  action: string;
  resource: string;
  resourceId: string;
  details?: Record<string, unknown>;
  ip?: string;
  createdAt: FirebaseTimestamp;
}

// ============ COLLECTION: referrals ============
export interface ReferralDoc {
  id: string;
  referrerId: string;
  refereeId: string;
  referralCode: string;
  reward: number;
  status: 'pending' | 'completed';
  createdAt: FirebaseTimestamp;
}

// ============ COLLECTION: voice_calls ============
export interface VoiceCallDoc {
  id: string;
  callId: string; // External telephony provider call ID (Exotel/Knowlarity)
  callerPhone: string;
  startTime: FirebaseTimestamp;
  endTime?: FirebaseTimestamp;
  duration?: number; // seconds
  recordingUrl?: string; // encrypted storage reference
  aiConfidenceScore?: number; // 0-100
  outcome: 'order_created' | 'escalated_to_human' | 'abandoned' | 'no_order' | 'call_dropped' | 'in_progress';
  linkedOrderId?: string; // FK → orders.id
  escalatedToHuman: boolean;
  escalationReason?: string;
  customerName?: string;
  detectedLanguage: 'ta' | 'en' | 'tanglish';
  metadata?: {
    telephonyProvider: string;
    region?: string;
    networkType?: string;
  };
  createdAt: FirebaseTimestamp;
  updatedAt: FirebaseTimestamp;
}

// ============ COLLECTION: voice_calls/{id}/transcript (subcollection) ============
export interface CallTranscriptTurnDoc {
  id: string;
  callId: string;
  turnIndex: number;
  speaker: 'ai' | 'customer';
  text: string;
  timestamp: FirebaseTimestamp;
  detectedLanguage: 'ta' | 'en' | 'tanglish';
  confidence?: number;
}

// ============ COLLECTION: human_escalations ============
export interface HumanEscalationDoc {
  id: string;
  callId: string; // FK → voice_calls.id
  reason: string;
  escalatedAt: FirebaseTimestamp;
  agentId?: string; // FK → users.uid (support agent)
  agentName?: string;
  resolution?: string;
  resolutionTime?: FirebaseTimestamp;
  status: 'queued' | 'assigned' | 'resolved' | 'unresolved';
  callContext: {
    transcriptSummary: string;
    partialOrder?: Record<string, unknown>;
    customerPhone: string;
    customerName?: string;
  };
  createdAt: FirebaseTimestamp;
}

// ============ COLLECTION: customer_voice_profiles ============
export interface CustomerVoiceProfileDoc {
  phoneNumber: string; // document ID = phone number
  knownName?: string;
  preferredLanguage: 'ta' | 'en' | 'tanglish';
  frequentItems: {
    name: string;
    nameTamil?: string;
    category: string;
    shopId?: string;
    orderCount: number;
  }[];
  lastOrderId?: string; // FK → orders.id
  totalVoiceOrders: number;
  defaultArea?: string;
  defaultAddress?: string;
  createdAt: FirebaseTimestamp;
  updatedAt: FirebaseTimestamp;
}

// ============ EXTENSION TO EXISTING orders COLLECTION ============
// Add these fields to OrderDoc:
export interface OrderVoiceExtension {
  orderSource: 'app' | 'whatsapp' | 'voice_call' | 'human_agent'; // NEW
  sourceCallId?: string; // FK → voice_calls.id (only for voice_call orders)
  customerPhone?: string; // phone number for voice-originated orders
  customerName?: string; // name captured during voice call
}

// Firebase Timestamp type placeholder
type FirebaseTimestamp = { seconds: number; nanoseconds: number } | Date;

/**
 * COMPOSITE INDEXES NEEDED:
 * 
 * 1. shops: (categoryId ASC, isApproved ASC, isOpen ASC, rating DESC)
 *    - Query: "shops in category X that are approved and open, sorted by rating"
 * 
 * 2. shops: (address.zoneId ASC, isOpen ASC, rating DESC)
 *    - Query: "shops near me (in my zone), open now, sorted by rating"
 * 
 * 3. products: (shopId ASC, categoryId ASC, isAvailable ASC, sortOrder ASC)
 *    - Query: "products in shop X, in category Y, available, sorted"
 * 
 * 4. orders: (customerId ASC, createdAt DESC)
 *    - Query: "my order history"
 * 
 * 5. orders: (shopId ASC, status ASC, createdAt DESC)
 *    - Query: "shop's pending orders"
 * 
 * 6. orders: (riderId ASC, status ASC, createdAt DESC)
 *    - Query: "rider's active/completed orders"
 */
