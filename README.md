# 🛵 Namma Ooru Express

**Tagline:** Neenga Sollunga... Naanga Deliver Pannuvom!

A production-ready **Hyperlocal Delivery Platform** — grocery, food, medicine, courier, and on-demand parcel delivery for Tamil Nadu, India. Starting in **Thanjavur–Kumbakonam**, architected to scale multi-city, multi-state.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + React + TypeScript + Tailwind CSS |
| State | Zustand (persisted) + React Query |
| Auth | Firebase Authentication (Phone OTP + Google + Email) |
| Database | Firebase Firestore (normalized schema) |
| Storage | Firebase Storage |
| Realtime | Socket.IO + Firebase Cloud Messaging |
| Maps | Google Maps Platform |
| Payments | Razorpay (UPI, Cards, Netbanking, Wallet, COD) |
| Backend | Node.js + Express (REST) + JWT |
| PWA | Installable, offline-capable, responsive |
| i18n | Tamil + English (externalized strings) |
| Deploy | Vercel (frontend) + Firebase Functions/Cloud Run + Docker |

---

## 📱 User Roles & Portals

### Customer App
- Browse nearby shops by category (17 categories)
- Cart, Checkout with UPI/Card/COD/Wallet
- Live order tracking with rider location
- Wallet, Loyalty Points, Coupons
- Favorites, Notifications, Referral & Earn
- Address book, Order history, Ratings

### Shop Owner / Vendor Portal
- KYC wizard + Approval workflow
- Product/Menu management with images
- Incoming orders (Accept/Reject/Ready)
- Sales analytics (daily/weekly/monthly)
- Settlement reports & Wallet

### Delivery Partner (Rider) App
- KYC + Vehicle verification
- Online/Offline toggle
- Live order requests with countdown
- Pickup & Delivery OTP
- Earnings dashboard + Incentives
- Heatmap, Attendance, SOS

### Admin Dashboard
- Full oversight: orders, revenue, commission
- Shop/Rider/Customer approvals
- Zone/City management
- Live rider map
- Coupons, Banners, CMS
- Reports, Audit logs, Support tickets

---

## 🔄 Order State Machine

```
placed → shop_notified → shop_accepted → rider_assigned → rider_accepted →
pickup_otp_verified → in_transit → delivery_otp_verified → payment_settled → rated → closed
```

Branch states: `cancelled` | `refunded` | `disputed`

---

## 📁 Project Structure

```
/src
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home (location-aware)
│   ├── shops/             # Shop listing & detail
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout flow
│   ├── track/             # Live order tracking
│   ├── orders/            # Order history
│   ├── wallet/            # Wallet & transactions
│   ├── favorites/         # Favorite shops
│   ├── notifications/     # Notification center
│   ├── categories/        # Category grid
│   ├── offers/            # Coupons & offers
│   ├── auth/              # Login & Register
│   ├── profile/           # User profile
│   ├── admin/             # Admin dashboard
│   ├── dashboard/shop/    # Vendor portal
│   └── dashboard/rider/   # Rider portal
├── components/
│   ├── ui/                # Design system (Button, Card, Input, Badge, Skeleton, BottomNav)
│   ├── layout/            # Header, Footer, ClientLayout
│   └── home/              # Home page sections
├── lib/
│   ├── firebase.ts        # Firebase config
│   ├── i18n.ts            # Tamil + English translations
│   ├── order-state-machine.ts  # Order flow state machine
│   ├── firestore-schema.ts     # Database schema
│   ├── seed-data.ts       # Demo data (Thanjavur–Kumbakonam)
│   └── constants.ts       # App constants
├── store/
│   └── useStore.ts        # Zustand global state
└── types/
    └── index.ts           # TypeScript interfaces
/server
└── index.js               # Express + Socket.IO backend
/firestore.rules           # Firestore security rules
/public
├── manifest.json          # PWA manifest
└── service-worker.js      # Offline support
```

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+
- Firebase project (Auth + Firestore + Storage + FCM)
- Google Maps API key
- Razorpay account (sandbox)

### Steps

```bash
# 1. Clone the repo
git clone <repo-url>
cd namma-ooru-express

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.local.example .env.local
# Fill in Firebase, Google Maps, Razorpay keys

# 4. Run development server
npm run dev

# 5. Run backend (optional, for Socket.IO)
npm run server
```

### Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
JWT_SECRET=
```

---

## 🐳 Docker

```bash
docker build -t namma-ooru-express .
docker run -p 3000:3000 namma-ooru-express
```

---

## 🎨 Design System

- **Palette:** Black + Yellow (brand) + White + Dark mode
- **Style:** Glassmorphism cards, rounded corners, soft shadows
- **Icons:** Emoji + Lucide React
- **Typography:** Display headings + legible body
- **Mobile-first:** Thumb-reachable actions, sticky cart bar, bottom nav
- **Performance:** Skeleton loaders, optimistic UI

---

## 🗺️ Deployment

### Frontend (Vercel)
```bash
vercel --prod
```

### Backend (Firebase Functions / Cloud Run)
```bash
gcloud run deploy --source .
```

---

## 📊 Database Schema

Collections: `users`, `shops`, `riders`, `products`, `categories`, `orders`, `order_items`, `payments`, `settlements`, `coupons`, `referrals`, `wallets`, `ratings_reviews`, `support_tickets`, `zones`, `cities`, `banners`, `notifications`, `audit_logs`

See `src/lib/firestore-schema.ts` for full schema documentation.

---

## 🔒 Security

- Firebase Auth rules per role
- JWT for backend APIs
- OTP verification (login + pickup + delivery)
- Rate limiting on public endpoints
- Encrypted KYC document storage
- Input sanitization (XSS/injection protection)
- Full audit logging
- See `firestore.rules` for Firestore security rules

---

## 🌍 Expansion Roadmap

| Phase | Area |
|-------|------|
| Pilot | Thanjavur → Kumbakonam |
| Phase 2 | Tamil Nadu (major cities) |
| Phase 3 | South India |
| Phase 4 | India-wide (franchise model) |

---

## 📞 Contact

**Namma Ooru Express**  
📱 Call/WhatsApp: 9566700534  
📧 support@nammaooru.express

---

Built with ❤️ for Tamil Nadu
