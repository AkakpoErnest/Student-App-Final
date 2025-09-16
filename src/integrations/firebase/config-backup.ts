// Backup Firebase configuration - replace with your new config
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// NEW FIREBASE PROJECT CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDjTpMrHi357S4H6i9SEhrRLjL8nzDZOyI",
  authDomain: "stufind-new.firebaseapp.com",
  projectId: "stufind-new",
  storageBucket: "stufind-new.firebasestorage.app",
  messagingSenderId: "368812484770",
  appId: "1:368812484770:web:4c9cd01ccd5fe00a6a8ffb",
  measurementId: "G-2710WLNXVB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

