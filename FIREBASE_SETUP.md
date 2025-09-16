# 🔥 Firebase Database Setup Guide

## 🚨 **Database Issue Detected**

Your Firebase database appears to have expired or there's a configuration issue. Let's fix this step by step!

## 🚀 **Quick Fix - New Firebase Project**

### **Step 1: Create New Firebase Project**

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/
   - Click **"Create a project"** or **"Add project"**

2. **Project Setup:**
   - **Project name:** `stufind-app` (or any name you prefer)
   - **Google Analytics:** Enable (recommended)
   - **Analytics account:** Create new or use existing
   - Click **"Create project"**

### **Step 2: Enable Required Services**

#### **A. Authentication:**
1. In Firebase Console → **Authentication** → **Get started**
2. Go to **Sign-in method** tab
3. Enable **Email/Password** authentication
4. Click **Save**

#### **B. Firestore Database:**
1. In Firebase Console → **Firestore Database** → **Create database**
2. Choose **"Start in test mode"** (for now)
3. Select **location** (choose closest to Ghana: `europe-west1`)
4. Click **"Done"**

#### **C. Storage:**
1. In Firebase Console → **Storage** → **Get started**
2. Choose **"Start in test mode"** (for now)
3. Select **location** (same as Firestore)
4. Click **"Done"**

### **Step 3: Get Configuration**

1. In Firebase Console → **Project Settings** (gear icon)
2. Scroll down to **"Your apps"** section
3. Click **"</>"** (Web app icon)
4. **App nickname:** `StuFind Web App`
5. **Firebase Hosting:** Don't set up (uncheck)
6. Click **"Register app"**
7. **Copy the config object** (it looks like this):

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### **Step 4: Update Your App Configuration**

Replace the config in `src/integrations/firebase/config.ts` with your new config:

```typescript
const firebaseConfig = {
  apiKey: "your-new-api-key",
  authDomain: "your-new-project.firebaseapp.com",
  projectId: "your-new-project-id",
  storageBucket: "your-new-project.appspot.com",
  messagingSenderId: "your-new-sender-id",
  appId: "your-new-app-id"
};
```

## 🛡️ **Security Rules Setup**

### **Firestore Rules:**
Go to **Firestore Database** → **Rules** and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own profile
    match /profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read opportunities
    match /opportunities/{opportunityId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write their own escrow transactions
    match /escrow_transactions/{transactionId} {
      allow read, write: if request.auth != null && 
        (resource.data.buyer_id == request.auth.uid || 
         resource.data.seller_id == request.auth.uid);
    }
  }
}
```

### **Storage Rules:**
Go to **Storage** → **Rules** and replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow users to upload their own avatars
    match /avatars/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow users to upload opportunity images
    match /opportunities/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🧪 **Test Your Setup**

### **Step 1: Test Authentication**
1. Go to your app: `http://localhost:8081`
2. Try to **sign up** with a new account
3. Check if user appears in **Firebase Console** → **Authentication**

### **Step 2: Test Database**
1. Try to **post an opportunity**
2. Check if data appears in **Firebase Console** → **Firestore Database**

### **Step 3: Test Storage**
1. Try to **upload an avatar**
2. Check if file appears in **Firebase Console** → **Storage**

## 🔧 **Alternative: Use Existing Project**

If you want to keep using your existing project:

### **Check Project Status:**
1. Go to **Firebase Console**
2. Check if project is **active** and **billing** is set up
3. If expired, you may need to **upgrade to Blaze plan**

### **Enable Billing:**
1. Go to **Project Settings** → **Usage and billing**
2. Click **"Upgrade to Blaze plan"**
3. Add payment method
4. Set **budget alerts** to avoid unexpected charges

## 📊 **Database Structure**

Your Firestore will have these collections:

### **profiles:**
```javascript
{
  id: "user-id",
  email: "user@example.com",
  full_name: "User Name",
  username: "username",
  avatar_url: "https://...",
  verification_status: "pending",
  tokens: 0,
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z"
}
```

### **opportunities:**
```javascript
{
  id: "opportunity-id",
  title: "Item Title",
  description: "Item description",
  price: 100,
  category: "electronics",
  status: "active",
  seller_id: "user-id",
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z"
}
```

### **escrow_transactions:**
```javascript
{
  id: "transaction-id",
  opportunity_id: "opportunity-id",
  buyer_id: "buyer-id",
  seller_id: "seller-id",
  amount: 100,
  status: "pending",
  payment_method: "momo",
  created_at: "2024-01-01T00:00:00.000Z"
}
```

## 🚨 **Common Issues & Solutions**

### **Issue: "Firebase project not found"**
- **Solution:** Check project ID in config
- **Solution:** Ensure project is active in Firebase Console

### **Issue: "Permission denied"**
- **Solution:** Check Firestore rules
- **Solution:** Ensure user is authenticated

### **Issue: "Storage permission denied"**
- **Solution:** Check Storage rules
- **Solution:** Ensure user is authenticated

### **Issue: "Quota exceeded"**
- **Solution:** Upgrade to Blaze plan
- **Solution:** Check usage in Firebase Console

## 💰 **Pricing Information**

### **Firebase Free Tier (Spark):**
- **Firestore:** 1GB storage, 50K reads, 20K writes per day
- **Storage:** 1GB storage, 10GB downloads per month
- **Authentication:** Unlimited users
- **Perfect for development and testing**

### **Firebase Blaze Plan:**
- **Pay as you go** - only pay for what you use
- **No daily limits**
- **Very affordable** for small to medium apps
- **Required for production apps**

## 🎉 **You're Ready!**

Once you've completed these steps:

1. ✅ **New Firebase project** created
2. ✅ **Authentication** enabled
3. ✅ **Firestore** database set up
4. ✅ **Storage** configured
5. ✅ **Security rules** applied
6. ✅ **Configuration** updated

Your StuFind app will have a fresh, working database! 🚀

---

**Need Help?** 
- Check Firebase Console for errors
- Test each service individually
- Contact Firebase support if needed