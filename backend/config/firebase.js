import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let firebaseAdmin = null;
let isDevMockAuth = false;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized successfully via Service Account JSON.');
  } else if (process.env.FIREBASE_PROJECT_ID) {
    firebaseAdmin = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID
    });
    console.log(`Firebase Admin SDK initialized with project ID: ${process.env.FIREBASE_PROJECT_ID}.`);
  } else {
    console.warn('WARNING: Firebase credentials are not provided. Starting in dev auth bypass mode.');
    isDevMockAuth = true;
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error.message);
  console.warn('Fallback to dev auth bypass mode.');
  isDevMockAuth = true;
}

export { firebaseAdmin, isDevMockAuth };
