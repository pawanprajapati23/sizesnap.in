const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
});
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
    })
  });
}
const db = admin.firestore();

async function check() {
  console.log("Checking DB...");
  const doc = await db.collection('admin_settings').doc('google_oauth').get();
  if (!doc.exists) {
    console.log("Doc does not exist!");
  } else {
    console.log("Doc exists! Keys:", Object.keys(doc.data()));
    const tokens = doc.data().tokens;
    if (tokens) {
      console.log("Tokens keys:", Object.keys(tokens));
      console.log("Has access_token:", !!tokens.access_token);
      console.log("Has refresh_token:", !!tokens.refresh_token);
    }
  }
}
check().catch(console.error);
