import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // If running on Vercel, use environment variables for the service account
    // For local dev, ensure these are set in .env.local
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace escaped newline characters from env string
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
