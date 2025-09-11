// Firebase client for web3 app
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  updateDoc,
  addDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { auth, db, storage } from './config';

// Export Firebase user type
export type User = FirebaseUser;

// Export Firebase services
export { auth, db, storage };

// Authentication functions
export const signUp = async (email: string, password: string, profileData?: any) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    if (profileData && user) {
      // Update profile
      await updateProfile(user, {
        displayName: profileData.full_name || profileData.username || email
      });
      
      // Save profile to Firestore
      await setDoc(doc(db, 'profiles', user.uid), {
        id: user.uid,
        email: user.email,
        full_name: profileData.full_name || '',
        username: profileData.username || '',
        avatar_url: profileData.avatar_url || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Database functions
export const getProfile = async (userId: string) => {
  try {
    const docRef = doc(db, 'profiles', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { profile: docSnap.data(), error: null };
    } else {
      return { profile: null, error: 'Profile not found' };
    }
  } catch (error) {
    return { profile: null, error };
  }
};

export const updateProfileData = async (userId: string, data: any) => {
  try {
    const docRef = doc(db, 'profiles', userId);
    await updateDoc(docRef, {
      ...data,
      updated_at: new Date().toISOString()
    });
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const getOpportunities = async (filters?: any) => {
  try {
    let q: any = collection(db, 'opportunities');
    
    if (filters) {
      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
    }
    
    // Remove orderBy to avoid index requirements - we'll sort client-side
    const querySnapshot = await getDocs(q);
    const opportunities = querySnapshot.docs.map(doc => {
      const data = doc.data() as any;
      return {
        id: doc.id,
        ...data
      };
    });
    
    // Sort client-side instead of using Firestore orderBy
    opportunities.sort((a: any, b: any) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB.getTime() - dateA.getTime();
    });
    
    return { opportunities, error: null };
  } catch (error) {
    return { opportunities: [], error };
  }
};

export const createOpportunity = async (data: any) => {
  try {
    const docRef = await addDoc(collection(db, 'opportunities'), {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error };
  }
};

// Storage functions
export const uploadImage = async (file: File, path: string) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { url: downloadURL, error: null };
  } catch (error) {
    return { url: null, error };
  }
};

export const deleteImage = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const uploadAvatar = async (userId: string, file: File) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}.${fileExt}`;
    const path = `avatars/${fileName}`;
    
    const { url, error } = await uploadImage(file, path);
    if (error) {
      throw error;
    }
    
    return { url, error: null };
  } catch (error) {
    return { url: null, error };
  }
};
