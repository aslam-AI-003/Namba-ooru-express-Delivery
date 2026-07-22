# 🔥 Firebase Production Setup Guide
## Namma Ooru Express - நம்ம ஊரு எக்ஸ்பிரஸ்

---

## 📋 Step 1: Create Firebase Project

### 1.1 Go to Firebase Console
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** or **"Add project"**
3. Project name: `namma-ooru-express` (or `noe-production`)
4. Enable Google Analytics (recommended for production)
5. Select or create a Google Analytics account
6. Click **Create project**

### 1.2 Note Your Project ID
- Your project ID will be something like: `namma-ooru-express` or `noe-production`
- This will be used in `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

---

## 🔐 Step 2: Enable Authentication

### 2.1 Enable Phone Authentication
1. Go to **Authentication** → **Sign-in method**
2. Click **Phone** → Enable it
3. Add test phone numbers for development:
   - `+919566700534` → Code: `123456`
   - `+919876543210` → Code: `123456`

### 2.2 Enable Google Sign-in
1. Click **Google** → Enable it
2. Add project support email
3. Click **Save**

### 2.3 Enable Email/Password (Optional)
1. Click **Email/Password** → Enable it
2. Enable **Email link** if needed

### 2.4 Authorized Domains
Add these domains in **Settings** → **Authorized domains**:
- `localhost`
- `nammaooru.express`
- `www.nammaooru.express`
- Your Vercel domain: `namma-ooru-express.vercel.app`

---

## 🗄️ Step 3: Create Firestore Database

### 3.1 Create Database
1. Go to **Firestore Database** → **Create database**
2. Choose **Production mode** (we have security rules)
3. Select location: `asia-south1` (Mumbai - closest to Tamil Nadu)
4. Click **Enable**

### 3.2 Deploy Security Rules
1. Go to **Rules** tab
2. Copy contents from `firestore.rules` file
3. Click **Publish**

### 3.3 Create Indexes
1. Go to **Indexes** tab
2. Create these composite indexes:

#### Index 1: Orders by User
| Collection | Fields | Query scope |
|------------|--------|-------------|
| orders | userId (Asc), createdAt (Desc) | Collection |

#### Index 2: Orders by Shop
| Collection | Fields | Query scope |
|------------|--------|-------------|
| orders | shopId (Asc), status (Asc), createdAt (Desc) | Collection |

#### Index 3: Shops by Category
| Collection | Fields | Query scope |
|------------|--------|-------------|
| shops | categoryId (Asc), isApproved (Asc), isOpen (Asc), rating (Desc) | Collection |

#### Index 4: Products by Shop
| Collection | Fields | Query scope |
|------------|--------|-------------|
| products | shopId (Asc), isAvailable (Asc), sortOrder (Asc) | Collection |

#### Index 5: Notifications by User
| Collection | Fields | Query scope |
|------------|--------|-------------|
| users/{uid}/notifications | createdAt (Desc) | Collection |

#### Index 6: Transactions by User
| Collection | Fields | Query scope |
|------------|--------|-------------|
| users/{uid}/transactions | createdAt (Desc) | Collection |

---

## 🔑 Step 4: Get Configuration Keys

### 4.1 Web App Configuration
1. Go to **Project settings** (gear icon)
2. Scroll to **Your apps** → Click **Web** (</> icon)
3. Register app name: `namma-ooru-express-web`
4. Copy the Firebase config object:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "namma-ooru-express.firebaseapp.com",
  projectId: "namma-ooru-express",
  storageBucket: "namma-ooru-express.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-XXXXXXXX"
};
```

### 4.2 Service Account (for Backend)
1. Go to **Project settings** → **Service accounts**
2. Click **Generate new private key**
3. Download the JSON file (keep it secure!)
4. From this file, you need:
   - `project_id` → `FIREBASE_ADMIN_PROJECT_ID`
   - `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY`

---

## 💾 Step 5: Enable Cloud Storage

### 5.1 Create Storage Bucket
1. Go to **Storage** → **Get started**
2. Choose **Production mode**
3. Select location: `asia-south1` (same as Firestore)
4. Click **Done**

### 5.2 Storage Rules
Replace default rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public read for shop images, product images
    match /shops/{shopId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /products/{productId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // User uploads (profile pics, KYC docs)
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }
    
    // Admin only - banners
    match /banners/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null; // TODO: Check admin role
    }
  }
}
```

---

## 📱 Step 6: Enable Cloud Messaging (FCM)

### 6.1 Generate Web Push Certificate
1. Go to **Project settings** → **Cloud Messaging**
2. Scroll to **Web configuration**
3. Click **Generate key pair**
4. Copy the key (this goes in your app for notifications)

### 6.2 Note the Server Key
- This is used for server-side push notifications
- Save it as `FCM_SERVER_KEY` in your environment

---

## ✅ Step 7: Update .env.local

Create or update `.env.local` file with your values:

```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=namma-ooru-express.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=namma-ooru-express
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=namma-ooru-express.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Firebase Admin (Server-side)
FIREBASE_ADMIN_PROJECT_ID=namma-ooru-express
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@namma-ooru-express.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...your_private_key...\n-----END PRIVATE KEY-----\n"

# App Configuration
NEXT_PUBLIC_APP_NAME=Namma Ooru Express
NEXT_PUBLIC_APP_URL=https://nammaooru.express
```

---

## 🌱 Step 8: Seed Initial Data

After setup, run the seed script to add:
- Categories
- Demo shops (Thanjavur & Kumbakonam)
- Demo products
- Coupons
- Banners

```bash
npm run seed
```

---

## 🧪 Step 9: Test Your Setup

### 9.1 Test Authentication
1. Run the app: `npm run dev`
2. Go to `/auth/login`
3. Try phone number login with test number
4. Check Firebase Console → Authentication → Users

### 9.2 Test Firestore
1. Create a test user
2. Check Firestore → users collection
3. Check that security rules work

### 9.3 Test Storage
1. Try uploading a profile picture
2. Check Storage → files

---

## 🚀 Production Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Phone, Google)
- [ ] Firestore database created
- [ ] Security rules deployed
- [ ] Indexes created
- [ ] Storage bucket created
- [ ] Storage rules deployed
- [ ] FCM configured
- [ ] .env.local updated
- [ ] Seed data uploaded
- [ ] Test authentication flow
- [ ] Test order creation
- [ ] Test real-time updates

---

## 🆘 Troubleshooting

### "Permission denied" error
- Check security rules
- Ensure user is authenticated
- Check user role in Firestore

### "Index required" error
- Create the suggested index in Firestore Console
- Wait 2-3 minutes for index to build

### Phone auth not working
- Check if phone provider is enabled
- Verify test phone numbers
- Check reCAPTCHA settings

---

## 📞 Support

For setup help, contact:
- WhatsApp: 9566700534
- Email: support@nammaooru.express
