# StuFind - Student Marketplace Platform

A comprehensive marketplace platform designed specifically for Ghanaian university students to buy, sell, find jobs, and connect with opportunities across major universities.

## 🎯 What StuFind Does

StuFind is a student-focused marketplace that addresses the unique needs of Ghanaian university students by providing:

### Core Features
- **🛒 Item Marketplace**: Buy and sell textbooks, electronics, clothing, furniture, and other student essentials
- **💼 Job Board**: Find internships, part-time jobs, and freelance opportunities
- **🎓 Service Exchange**: Offer and hire services like tutoring, project help, and academic support
- **💰 Mobile Money Payments**: Secure transactions using Ghana's major mobile money providers
- **📱 WhatsApp Integration**: Buy and sell through WhatsApp for convenience
- **🏫 University Verification**: Verified student system for trust and security
- **🪙 Token Rewards**: Earn tokens for engagement and complete transactions

### Target Universities
- University of Ghana (UG)
- Kwame Nkrumah University of Science and Technology (KNUST)
- University of Cape Coast (UCC)
- Ashesi University
- And other major Ghanaian universities

## 🛠️ Technology Stack & Integrations

### Frontend Architecture
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for beautiful, accessible components
- **React Router** for client-side routing
- **React Query** for server state management

### Backend & Database
- **Firebase Authentication** for user management
- **Firestore** for real-time database operations
- **Firebase Storage** for file and image uploads
- **Firebase Hosting** ready for deployment

### Payment Integration
- **Mobile Money APIs** for Ghana's payment ecosystem:
  - MTN Mobile Money
  - Vodafone Cash
  - AirtelTigo Money
- **Secure transaction handling** with status tracking
- **Payment webhooks** for real-time updates

### Communication & Automation
- **WhatsApp Business API** integration
- **Webhook handling** for message processing
- **Bot service** for automated responses
- **Real-time analytics** dashboard

### Development Tools
- **ESLint** for code quality
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Hot Module Replacement** for fast development

## 🚀 Getting Started - Complete Setup Guide

This comprehensive guide will walk you through setting up StuFind from scratch, including all necessary configurations and integrations.

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**
- **Git** ([Download here](https://git-scm.com/))
- **Firebase account** ([Sign up here](https://firebase.google.com/))
- **Code editor** (VS Code recommended)

### 🔧 Step-by-Step Installation

#### 1. Clone the Repository
```bash
# Clone the repository
git clone https://github.com/AkakpoErnest/Student-App-Final.git

# Navigate to the project directory
cd Student-App-Final

# Verify you're in the correct directory
ls -la
```

#### 2. Install Dependencies
```bash
# Install all required packages
npm install

# Verify installation
npm list --depth=0
```

#### 3. Firebase Project Setup

**Step 3a: Create Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `stufind-yourname` (replace with your name)
4. Enable Google Analytics (recommended)
5. Choose Analytics account or create new
6. Click **"Create project"**

**Step 3b: Add Web App**
1. In your Firebase project, click **"Web"** icon (`</>`)
2. Register app with nickname: `stufind-web`
3. Enable Firebase Hosting (optional)
4. Click **"Register app"**
5. **Copy the Firebase configuration** - you'll need this for the next step

**Step 3c: Enable Firebase Services**
1. **Authentication**:
   - Go to **Authentication** → **Get started**
   - Go to **Sign-in method** tab
   - Enable **Email/Password**
   - Click **"Save"**

2. **Firestore Database**:
   - Go to **Firestore Database** → **Create database**
   - Choose **"Start in test mode"**
   - Select region: **"us-central1"** (or closest to your location)
   - Click **"Done"**

3. **Storage**:
   - Go to **Storage** → **Get started**
   - Choose **"Start in test mode"**
   - Select region: **"us-central1"**
   - Click **"Done"**

#### 4. Environment Configuration

**Step 4a: Create Environment File**
```bash
# Create the environment file
touch .env.local
```

**Step 4b: Add Firebase Configuration**
Open `.env.local` and add your Firebase config:
```env
# Firebase Configuration (from Firebase Console)
VITE_FIREBASE_API_KEY=AIzaSyYourApiKeyHere
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Optional: Mobile Money API Keys (for payment features)
VITE_MTN_API_KEY=your-mtn-api-key
VITE_VODAFONE_API_KEY=your-vodafone-api-key
VITE_AIRTELTIGO_API_KEY=your-airteltigo-api-key
```

**Step 4c: Update Firebase Config**
Open `src/integrations/firebase/config.ts` and replace the config:
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
```

#### 5. Configure Security Rules

**Step 5a: Firestore Rules**
1. Go to **Firestore Database** → **Rules**
2. Replace the rules with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Allow public read access to opportunities
    match /opportunities/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Allow public read access to profiles
    match /profiles/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
3. Click **"Publish"**

**Step 5b: Storage Rules**
1. Go to **Storage** → **Rules**
2. Replace the rules with:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
3. Click **"Publish"**

#### 6. Run the Application

**Step 6a: Start Development Server**
```bash
# Start the development server
npm run dev

# You should see output like:
# VITE v5.4.19  ready in 142 ms
# ➜  Local:   http://localhost:8080/
# ➜  Network: http://192.168.1.100:8080/
```

**Step 6b: Test the Application**
1. Open your browser and go to `http://localhost:8080`
2. You should see the StuFind home page
3. Test Firebase connection at `http://localhost:8080/firebase-test`
4. Create an account at `http://localhost:8080/auth`

#### 7. Verify Setup

**Step 7a: Test Firebase Connection**
1. Go to `http://localhost:8080/firebase-test`
2. You should see:
   - ✅ Authentication: Connected
   - ✅ Firestore: Connected
   - ✅ Storage: Connected

**Step 7b: Test User Registration**
1. Go to `http://localhost:8080/auth`
2. Click **"Sign Up"**
3. Create a test account
4. Verify you can log in and access the dashboard

**Step 7c: Test Profile Features**
1. Go to `http://localhost:8080/dashboard`
2. Click on **"Profile"** tab
3. Try uploading a profile picture
4. Update your profile information

### 🚨 Troubleshooting

#### Common Issues and Solutions

**Issue: Blank page or app not loading**
```bash
# Solution: Check for JavaScript errors
# 1. Open browser developer tools (F12)
# 2. Check Console tab for errors
# 3. Restart the dev server
pkill -f "npm run dev"
npm run dev
```

**Issue: Firebase connection errors**
```bash
# Solution: Verify Firebase configuration
# 1. Check .env.local file exists and has correct values
# 2. Verify Firebase project is created and services enabled
# 3. Check browser console for specific error messages
```

**Issue: Profile picture upload fails**
```bash
# Solution: Check Firebase Storage setup
# 1. Verify Storage is enabled in Firebase Console
# 2. Check Storage rules are published
# 3. Ensure user is authenticated
```

**Issue: Database permission errors**
```bash
# Solution: Update Firestore rules
# 1. Go to Firebase Console → Firestore → Rules
# 2. Ensure rules are published
# 3. Check that user is authenticated
```

#### Getting Help

If you encounter issues:
1. **Check the console**: Open browser developer tools and look for errors
2. **Verify setup**: Ensure all steps above are completed
3. **Test Firebase**: Use the `/firebase-test` page to diagnose issues
4. **Check logs**: Look at the terminal running `npm run dev` for errors

### 🎯 Next Steps

Once setup is complete:
1. **Explore the app**: Navigate through all pages and features
2. **Create test data**: Add some sample opportunities
3. **Test payments**: Try the Mobile Money integration
4. **Customize**: Modify the app to fit your needs
5. **Deploy**: Follow the deployment guide below

## 🔧 Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Follow the setup wizard

### 2. Enable Services
- **Authentication**: Enable Email/Password sign-in
- **Firestore Database**: Create database in test mode
- **Storage**: Enable for file uploads

### 3. Configure Security Rules

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    match /opportunities/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📱 Application Features

### User Authentication & Profiles
- **Email/Password Registration**: Secure account creation
- **Profile Management**: Complete user profiles with university verification
- **Avatar Upload**: Profile picture management with Firebase Storage
- **Token System**: Earn tokens for engagement and transactions

### Marketplace Functionality
- **Browse Opportunities**: Filter by category, type, university, location
- **Post Listings**: Create detailed item/service listings with images
- **Search & Filter**: Advanced search capabilities
- **Real-time Updates**: Live data synchronization

### Payment System
- **Mobile Money Integration**: Support for all major Ghanaian providers
- **Secure Transactions**: Encrypted payment processing
- **Transaction History**: Complete payment tracking
- **Status Updates**: Real-time payment notifications

### WhatsApp Bot Features
- **Automated Responses**: AI-powered customer service
- **Order Management**: Process orders through WhatsApp
- **Payment Instructions**: Send payment details via WhatsApp
- **Analytics Dashboard**: Track bot performance and user engagement

## 🗂️ Project Structure

```
src/
├── components/                 # Reusable UI components
│   ├── ui/                    # shadcn/ui components
│   ├── dashboard/             # Dashboard-specific components
│   ├── profile/               # Profile management components
│   └── tokens/                # Token system components
├── pages/                     # Main application pages
│   ├── Index.tsx              # Home page
│   ├── Marketplace.tsx        # Browse opportunities
│   ├── Dashboard.tsx          # User dashboard
│   ├── Auth.tsx               # Authentication
│   └── WhatsAppBot.tsx        # Bot management
├── hooks/                     # Custom React hooks
│   ├── useDashboard.ts        # Dashboard data management
│   ├── useStatistics.ts      # App statistics
│   └── useTokens.ts           # Token system
├── integrations/              # External service integrations
│   ├── firebase/              # Firebase configuration
│   │   ├── config.ts          # Firebase setup
│   │   └── client.ts          # Firebase operations
│   ├── payment/               # Payment integrations
│   │   └── momo.ts            # Mobile Money APIs
│   └── whatsapp/               # WhatsApp integration
└── utils/                     # Helper functions and utilities
```

## 🌐 Available Routes

- **`/`** - Home page with featured opportunities
- **`/marketplace`** - Browse all available opportunities
- **`/dashboard`** - User dashboard and profile management
- **`/auth`** - Login and registration
- **`/post-opportunity`** - Create new listings
- **`/whatsapp-bot`** - WhatsApp bot management dashboard
- **`/momo-test`** - Mobile Money payment testing
- **`/firebase-test`** - Firebase connection testing
- **`/how-it-works`** - App explanation and features

## 💳 Mobile Money Integration

### Supported Providers
- **MTN Mobile Money**: Ghana's largest mobile money provider
- **Vodafone Cash**: Vodafone's mobile payment service
- **AirtelTigo Money**: Combined Airtel and Tigo services

### Payment Flow
1. User initiates payment through app
2. Payment request sent to provider API
3. User receives payment instructions via SMS/WhatsApp
4. Payment status tracked in real-time
5. Transaction completed and confirmed

### API Integration
```typescript
// Example payment initiation
const payment = await initiatePayment({
  amount: 100,
  currency: 'GHS',
  provider: 'mtn',
  phone: '+233123456789',
  reference: 'order-123'
});
```

## 🤖 WhatsApp Bot Integration

### Features
- **Automated Customer Service**: Handle common queries
- **Order Processing**: Take orders through WhatsApp
- **Payment Instructions**: Send payment details
- **Status Updates**: Notify users of order progress

### Webhook Setup
```typescript
// Webhook endpoint for WhatsApp messages
app.post('/webhook/whatsapp', (req, res) => {
  const message = req.body;
  // Process incoming message
  // Send automated response
});
```

## 🎨 UI/UX Design

### Design System
- **Light Theme Default**: Clean, professional appearance
- **Responsive Design**: Works on all device sizes
- **Accessibility**: WCAG compliant components
- **Ghanaian Context**: Colors and imagery relevant to Ghana

### Component Library
- **shadcn/ui**: Modern, accessible components
- **Tailwind CSS**: Utility-first styling
- **Lucide Icons**: Consistent iconography
- **Custom Components**: StuFind-specific UI elements

## 🚀 Deployment Guide

### 📦 Build the Application

Before deploying, build the production version:

```bash
# Install dependencies (if not already done)
npm install

# Build for production
npm run build

# Verify build was successful
ls -la dist/
```

### 🌐 Deployment Options

#### Option 1: Vercel (Recommended)

**Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

**Step 2: Deploy**
```bash
# Login to Vercel
vercel login

# Deploy from project directory
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name? stufind-marketplace
# - Directory? ./
# - Override settings? No
```

**Step 3: Configure Environment Variables**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add all variables from your `.env.local` file:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

**Step 4: Redeploy**
```bash
vercel --prod
```

#### Option 2: Netlify

**Step 1: Install Netlify CLI**
```bash
npm install -g netlify-cli
```

**Step 2: Build and Deploy**
```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist

# Follow the prompts to authenticate and deploy
```

**Step 3: Configure Environment Variables**
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Add all Firebase environment variables

#### Option 3: Firebase Hosting

**Step 1: Install Firebase CLI**
```bash
npm install -g firebase-tools
```

**Step 2: Initialize Firebase Hosting**
```bash
# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Follow the prompts:
# - Select Firebase project
# - Public directory? dist
# - Single-page app? Yes
# - Overwrite index.html? No
```

**Step 3: Deploy**
```bash
# Build the project
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

### 🔧 Post-Deployment Configuration

#### 1. Update Firebase Authorized Domains
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your deployed domain (e.g., `your-app.vercel.app`)

#### 2. Configure CORS (if needed)
If you encounter CORS issues, update your Firebase Storage rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### 3. Test Production Deployment
1. Visit your deployed URL
2. Test user registration/login
3. Test profile picture upload
4. Test marketplace functionality
5. Check Firebase connection at `/firebase-test`

### 📊 Monitoring and Analytics

#### Firebase Analytics
- Automatically enabled in production
- Track user behavior and app performance
- View in Firebase Console → Analytics

#### Performance Monitoring
- Monitor app performance in Firebase Console
- Set up alerts for errors and performance issues
- Track Core Web Vitals

### 🔒 Security Considerations

#### Environment Variables
- Never commit `.env.local` to version control
- Use platform-specific environment variable systems
- Rotate API keys regularly

#### Firebase Security Rules
- Review and tighten security rules for production
- Implement proper user authentication checks
- Monitor for suspicious activity

#### HTTPS
- All major hosting platforms provide HTTPS by default
- Ensure all API calls use HTTPS
- Update Firebase configuration if needed

### 🚨 Troubleshooting Deployment

#### Common Deployment Issues

**Issue: Build fails**
```bash
# Solution: Check for TypeScript errors
npm run build
# Fix any TypeScript errors before deploying
```

**Issue: Environment variables not working**
```bash
# Solution: Verify environment variables are set
# Check platform-specific documentation for env var setup
```

**Issue: Firebase connection fails in production**
```bash
# Solution: Check authorized domains
# Add your production domain to Firebase authorized domains
```

**Issue: Images not loading**
```bash
# Solution: Check Firebase Storage rules
# Ensure Storage rules allow public read access for images
```

### 📈 Performance Optimization

#### Build Optimization
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist/

# Optimize images
# Use WebP format for better compression
# Implement lazy loading for images
```

#### Runtime Optimization
- Enable Firebase caching
- Implement service worker for offline functionality
- Use React.lazy() for code splitting
- Optimize images and assets

---

**Your StuFind app is now ready for production!** 🚀

## 🔒 Security Features

- **Firebase Authentication**: Secure user management
- **Firestore Security Rules**: Database access control
- **Storage Security**: File upload protection
- **Payment Encryption**: Secure transaction processing
- **Input Validation**: Prevent malicious inputs

## 📊 Analytics & Monitoring

- **Firebase Analytics**: User behavior tracking
- **Performance Monitoring**: App performance metrics
- **Error Tracking**: Automatic error reporting
- **Custom Analytics**: Business metrics tracking

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes**: Follow coding standards
4. **Test thoroughly**: Ensure all features work
5. **Submit pull request**: Describe changes clearly

### Development Guidelines
- Use TypeScript for all new code
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure mobile responsiveness

## 📄 License

This project is for educational purposes and demonstrates modern web development practices for student marketplaces.

## 🙏 Acknowledgments

- **Ghanaian Universities**: For inspiring the platform
- **Mobile Money Providers**: For payment integration
- **Firebase**: For backend infrastructure
- **React Community**: For excellent tooling

---

**Built with ❤️ for Ghanaian students, by students.** 🇬🇭

*Empowering the next generation of Ghanaian entrepreneurs and professionals.*
