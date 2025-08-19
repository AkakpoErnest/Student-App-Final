# Firebase Setup Guide

This app has been migrated from Supabase to Firebase. Follow these steps to set up Firebase:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Follow the setup wizard

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Optionally enable other providers as needed

## 3. Enable Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location close to your users

## 4. Enable Storage (Optional)

1. Go to "Storage" in the left sidebar
2. Click "Get started"
3. Choose "Start in test mode" for development
4. Select a location

## 5. Get Configuration

1. Click the gear icon next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web app icon (</>) or create a new web app
5. Copy the configuration object

## 6. Update Configuration

1. Open `src/integrations/firebase/config.ts`
2. Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

## 7. Set Up Security Rules

### Firestore Rules
Go to Firestore Database > Rules and update with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read their own profile
    match /profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read opportunities
    match /opportunities/{opportunityId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.user_id;
    }
    
    // Allow users to manage their own tokens
    match /user_tokens/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow users to manage their own claims
    match /token_claims/{claimId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.user_id;
    }
  }
}
```

### Storage Rules (if using storage)
Go to Storage > Rules and update with:

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

## 8. Test the App

1. Run `npm run dev`
2. Try to sign up/sign in
3. Check the browser console for any errors
4. Verify that data is being stored in Firestore

## Troubleshooting

- **Authentication errors**: Check that Email/Password auth is enabled
- **Database errors**: Verify Firestore is created and rules are set
- **CORS errors**: Check that your domain is added to authorized domains in Firebase Auth settings

## Migration Notes

- User IDs now use Firebase UID instead of Supabase UUID
- Database queries use Firestore syntax instead of Supabase
- Authentication state management has been updated for Firebase
- All Supabase references have been removed from the codebase
