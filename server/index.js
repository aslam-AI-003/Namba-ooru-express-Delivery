const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// ━━━━ SECURITY: Restricted CORS ━━━━
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://nammaooru.express',
  'https://www.nammaooru.express',
  process.env.NEXT_PUBLIC_APP_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, server-to-server)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json({ limit: '10mb' })); // Limit payload size for security
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Security headers for API
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ── Voice Call Ordering Routes ──
const voiceRoutes = require('./voice-routes');
app.use('/api/voice', voiceRoutes);

// ==========================================
// API Routes
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Namma Ooru Express API is running!' });
});

// ---- AUTH ROUTES ----
app.post('/api/auth/register', (req, res) => {
  // Firebase Auth handles actual registration
  // This endpoint stores additional user data
  res.json({ success: true, message: 'User registered successfully' });
});

app.post('/api/auth/verify-token', (req, res) => {
  // Verify Firebase ID token
  res.json({ success: true, user: {} });
});

// ---- SHOP ROUTES ----
app.get('/api/shops', (req, res) => {
  // Get nearby shops based on location
  res.json({ shops: [], total: 0 });
});

app.get('/api/shops/:id', (req, res) => {
  res.json({ shop: null });
});

app.get('/api/shops/:id/products', (req, res) => {
  res.json({ products: [], total: 0 });
});

app.post('/api/shops/register', (req, res) => {
  res.json({ success: true, shopId: '' });
});

app.put('/api/shops/:id/status', (req, res) => {
  res.json({ success: true });
});

// ---- ORDER ROUTES ----
app.post('/api/orders', (req, res) => {
  // Create new order
  res.json({ success: true, orderId: '', orderNumber: '' });
});

app.get('/api/orders/:id', (req, res) => {
  res.json({ order: null });
});

app.put('/api/orders/:id/status', (req, res) => {
  // Update order status
  res.json({ success: true });
});

app.post('/api/orders/:id/cancel', (req, res) => {
  res.json({ success: true });
});

app.get('/api/orders/user/:userId', (req, res) => {
  res.json({ orders: [], total: 0 });
});

// ---- DELIVERY PARTNER ROUTES ----
app.post('/api/riders/register', (req, res) => {
  res.json({ success: true, riderId: '' });
});

app.put('/api/riders/:id/status', (req, res) => {
  // Toggle online/offline
  res.json({ success: true });
});

app.put('/api/riders/:id/location', (req, res) => {
  // Update rider location
  res.json({ success: true });
});

app.post('/api/riders/:id/accept-order', (req, res) => {
  res.json({ success: true });
});

app.post('/api/riders/:id/reject-order', (req, res) => {
  res.json({ success: true });
});

// ---- PAYMENT ROUTES ----
app.post('/api/payments/create-order', (req, res) => {
  // Create Razorpay order
  res.json({ orderId: '', amount: 0, currency: 'INR' });
});

app.post('/api/payments/verify', (req, res) => {
  res.json({ success: true });
});

// ---- ADMIN ROUTES ----
app.get('/api/admin/dashboard', (req, res) => {
  res.json({ stats: {} });
});

app.get('/api/admin/orders', (req, res) => {
  res.json({ orders: [], total: 0 });
});

app.put('/api/admin/shops/:id/approve', (req, res) => {
  res.json({ success: true });
});

app.put('/api/admin/riders/:id/approve', (req, res) => {
  res.json({ success: true });
});

// ---- COUPON ROUTES ----
app.post('/api/coupons/validate', (req, res) => {
  res.json({ valid: false, discount: 0 });
});

// ---- NOTIFICATION ROUTES ----
app.post('/api/notifications/send', (req, res) => {
  res.json({ success: true });
});

// ==========================================
// Socket.IO - Real-time Communication
// ==========================================

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join room based on user role
  socket.on('join-room', (data) => {
    const { userId, role, orderId } = data;
    socket.join(`user-${userId}`);
    if (role) socket.join(`role-${role}`);
    if (orderId) socket.join(`order-${orderId}`);
  });

  // Rider location update
  socket.on('rider-location-update', (data) => {
    const { riderId, orderId, latitude, longitude } = data;
    // Broadcast to order tracking room
    if (orderId) {
      io.to(`order-${orderId}`).emit('location-update', {
        riderId, latitude, longitude, timestamp: new Date()
      });
    }
  });

  // New order notification to shops
  socket.on('new-order', (data) => {
    const { shopId, order } = data;
    io.to(`user-${shopId}`).emit('order-received', order);
  });

  // Order status update
  socket.on('order-status-update', (data) => {
    const { orderId, status, customerId, riderId } = data;
    io.to(`order-${orderId}`).emit('status-update', { status, timestamp: new Date() });
    io.to(`user-${customerId}`).emit('order-update', { orderId, status });
    if (riderId) io.to(`user-${riderId}`).emit('order-update', { orderId, status });
  });

  // Delivery request to nearest rider
  socket.on('assign-rider', (data) => {
    const { riderId, orderDetails } = data;
    io.to(`user-${riderId}`).emit('delivery-request', orderDetails);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ==========================================
// Start Server
// ==========================================

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🛵 Namma Ooru Express API running on port ${PORT}`);
  console.log(`📡 Socket.IO ready for real-time connections`);
});
