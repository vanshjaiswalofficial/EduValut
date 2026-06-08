import axios from 'axios';
import { auth, isDemoMode } from './firebase.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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
