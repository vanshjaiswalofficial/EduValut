import axios from 'axios';
import { auth, isDemoMode } from './firebase.js';

let baseUrl = import.meta.env.VITE_API_URL;

if (!baseUrl) {
  if (import.meta.env.PROD) {
    console.warn("WARNING: VITE_API_URL is undefined in production! Falling back to localhost.");
  }
  baseUrl = 'http://localhost:5000/api';
} else if (!baseUrl.endsWith('/api')) {
  baseUrl = baseUrl.endsWith('/') ? `${baseUrl}api` : `${baseUrl}/api`;
}

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach bearer token
api.interceptors.request.use(
  async (config) => {
    let token = null;

    if (isDemoMode) {
      // In demo mode, read token from localStorage
      token = localStorage.getItem('eduvault_demo_token');
    } else if (auth && auth.currentUser) {
      try {
        // Retrieve ID token from Firebase
        token = await auth.currentUser.getIdToken(true);
      } catch (err) {
        console.error('Failed to retrieve Firebase ID token', err);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
