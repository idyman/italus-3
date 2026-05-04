import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC18nk8B1UlH2rWbhNtenceNnJooE-FIiA",
  authDomain: "italus-c3a03.firebaseapp.com",
  projectId: "italus-c3a03",
  storageBucket: "italus-c3a03.firebasestorage.app",
  messagingSenderId: "103043607734",
  appId: "1:103043607734:web:4bcdbec6725c2c58e84a17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
