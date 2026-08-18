// Client-side Firebase initialization (Only loaded when needed)
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBayDRzocfhvlcwQpK1BEVdfBfTbuP1KNs",
  authDomain: "sizesnapji.firebaseapp.com",
  projectId: "sizesnapji",
  storageBucket: "sizesnapji.firebasestorage.app",
  messagingSenderId: "350460574294",
  appId: "1:350460574294:web:3f788a1f3a84748bf4d9f7"
};

// Initialize Firebase only on the client or when explicitly requested
// Avoids initializing if config is missing (e.g. during public SSG build)
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

if (typeof window !== 'undefined' && firebaseConfig.projectId) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };
