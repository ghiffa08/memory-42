import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyA7cHnxcfkn-oHSBBixd1bGVAWfKfczQLc",
  authDomain: "kelompok-42-ee440.firebaseapp.com",
  projectId: "kelompok-42-ee440",
  storageBucket: "kelompok-42-ee440.firebasestorage.app",
  messagingSenderId: "686136138819",
  appId: "1:686136138819:web:6fcf0fa45439e0fd7988f6",
  measurementId: "G-K1Q3ELCF35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const storage = getStorage(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;