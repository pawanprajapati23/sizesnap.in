import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PRIVATE_KEY !== 'dummy-private-key') {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    }
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.message);
  }
}

export const adminAuth = admin.apps.length ? admin.auth() : {} as any;
export const adminDb = admin.apps.length ? admin.firestore() : {
  collection: () => ({
    where: () => ({
      orderBy: () => ({
        limit: () => ({
          get: async () => ({ docs: [] })
        }),
        get: async () => ({ docs: [] })
      }),
      get: async () => ({ docs: [] })
    }),
    orderBy: () => ({
      limit: () => ({
        get: async () => ({ docs: [] })
      }),
      get: async () => ({ docs: [] })
    }),
    get: async () => ({ docs: [] })
  })
} as any;
