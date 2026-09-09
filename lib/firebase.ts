// Client-side Firebase initialization (Only loaded when needed)
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getDatabase, Database } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBayDRzocfhvlcwQpK1BEVdfBfTbuP1KNs",
  authDomain: "sizesnapji.firebaseapp.com",
  projectId: "sizesnapji",
  storageBucket: "sizesnapji.firebasestorage.app",
  messagingSenderId: "350460574294",
  appId: "1:350460574294:web:3f788a1f3a84748bf4d9f7",
  databaseURL: "https://sizesnapji-default-rtdb.firebaseio.com" // Important for Realtime DB
};

// Initialize Firebase only on the client or when explicitly requested
// Avoids initializing if config is missing (e.g. during public SSG build)
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let rtdb: Database | undefined;

if (typeof window !== 'undefined' && firebaseConfig.projectId) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  rtdb = getDatabase(app);
}

export { app, auth, db, rtdb };
