import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if we are running with mock keys
const isDemoMode = !firebaseConfig.apiKey || firebaseConfig.apiKey === 'mock-api-key';

let app = null;
let auth = null;
let storage = null;
let googleProvider = null;

if (!isDemoMode) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    storage = getStorage(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.error('Firebase Initialization Error:', error.message);
  }
} else {
  console.warn('Running EduVault in DEMO bypass mode. Firebase config is placeholder.');
}

export { auth, storage, googleProvider, isDemoMode };
