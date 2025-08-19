// Firebase configuration for web3 app
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyASIBshW6_g8ft1jxmeoz7ZuxJW36jkvCo",
  authDomain: "stufind-50c62.firebaseapp.com",
  projectId: "stufind-50c62",
  storageBucket: "stufind-50c62.firebasestorage.app",
  messagingSenderId: "133150022141",
  appId: "1:133150022141:web:8869ce20b048212d3a2194"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
