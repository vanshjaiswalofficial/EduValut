import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider, isDemoMode } from '../services/firebase.js';
import api from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync Firebase status with MongoDB User profile
  const syncProfile = async (fUser, registrationData = {}) => {
    try {
      const response = await api.post('/auth/sync', registrationData);
      setDbUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error('Failed to sync user profile with backend', error);
      throw error;
    }
  };

  useEffect(() => {
    if (isDemoMode) {
      // Demo Mode Auth Initialization
      const storedToken = localStorage.getItem('eduvault_demo_token');
      const storedUser = localStorage.getItem('eduvault_demo_user');
      
      if (storedToken && storedUser) {
        try {
          const userObj = JSON.parse(storedUser);
          setFirebaseUser({
            uid: storedToken,
            email: userObj.email,
            displayName: userObj.name,
          });
          setDbUser(userObj);
        } catch (e) {
          localStorage.removeItem('eduvault_demo_token');
          localStorage.removeItem('eduvault_demo_user');
        }
      }
      setLoading(false);
    } else {
      // Live Firebase Auth Listener
      const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
        setFirebaseUser(fUser);
        if (fUser) {
          try {
            await syncProfile(fUser);
          } catch (e) {
            console.error('Initial profile sync failed');
          }
        } else {
          setDbUser(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    }
  }, []);

  // Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      if (isDemoMode) {
        // Mock token depending on email prefix
        const token = email.includes('admin') ? 'dev-admin-uid' : 'dev-student-uid';
        localStorage.setItem('eduvault_demo_token', token);
        
        // Sync mock credentials with backend database
        const response = await api.post('/auth/sync');
        localStorage.setItem('eduvault_demo_user', JSON.stringify(response.data.user));
        
        setFirebaseUser({
          uid: token,
          email: response.data.user.email,
          displayName: response.data.user.name,
        });
        setDbUser(response.data.user);
        setLoading(false);
        return response.data.user;
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = await syncProfile(userCredential.user);
        setLoading(false);
        return user;
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Sign up
  const signup = async (name, email, password, registrationData = {}) => {
    setLoading(true);
    try {
      if (isDemoMode) {
        // Setup details for demo sandbox
        const token = email.includes('admin') ? 'dev-admin-uid' : 'dev-student-uid';
        localStorage.setItem('eduvault_demo_token', token);

        const payload = {
          name,
          email,
          ...registrationData
        };

        const response = await api.post('/auth/sync', payload);
        localStorage.setItem('eduvault_demo_user', JSON.stringify(response.data.user));

        setFirebaseUser({
          uid: token,
          email: email,
          displayName: name,
        });
        setDbUser(response.data.user);
        setLoading(false);
        return response.data.user;
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = await syncProfile(userCredential.user, {
          name,
          email,
          ...registrationData
        });
        setLoading(false);
        return user;
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Google Sign In
  const googleSignIn = async () => {
    setLoading(true);
    try {
      if (isDemoMode) {
        return await login('student@eduvault.com', 'bypass');
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        const user = await syncProfile(result.user);
        setLoading(false);
        return user;
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    if (isDemoMode) {
      return Promise.resolve();
    }
    return sendPasswordResetEmail(auth, email);
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      if (isDemoMode) {
        localStorage.removeItem('eduvault_demo_token');
        localStorage.removeItem('eduvault_demo_user');
      } else {
        await signOut(auth);
      }
      setFirebaseUser(null);
      setDbUser(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Update profile data in DB and local state
  const updateDbProfile = async (profileData) => {
    try {
      const response = await api.put('/user/profile', profileData);
      setDbUser(response.data.user);
      if (isDemoMode) {
        localStorage.setItem('eduvault_demo_user', JSON.stringify(response.data.user));
      }
      return response.data.user;
    } catch (error) {
      console.error('Failed to update profile details', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        user: dbUser,
        loading,
        login,
        signup,
        googleSignIn,
        forgotPassword,
        logout,
        updateProfile: updateDbProfile,
        syncProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
