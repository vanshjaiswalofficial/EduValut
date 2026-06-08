import { firebaseAdmin, isDevMockAuth } from '../config/firebase.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { mockUsers } from '../config/mockStore.js';

// Verify Token and attach user to request
export const checkAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, token missing' });
    }

    let decodedToken = null;

    // Handle Developer Auth Bypass Mode
    if (isDevMockAuth || token.startsWith('dev-')) {
      if (token === 'dev-admin-uid') {
        decodedToken = {
          uid: 'dev-admin-uid',
          email: 'admin@eduvault.com',
          name: 'System Admin',
        };
      } else {
        // Fallback or dev-student-uid
        decodedToken = {
          uid: 'dev-student-uid',
          email: 'student@eduvault.com',
          name: 'Academic Student',
        };
      }
    } else {
      // Standard Firebase token verification
      try {
        decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      } catch (err) {
        return res.status(401).json({ message: 'Token verification failed', error: err.message });
      }
    }

    req.firebaseUser = decodedToken;

    let user = null;

    // Retrieve database user (Only if DB connection is active)
    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ firebaseUid: decodedToken.uid });
      
      // Auto-create user profile in dev bypass mode if not existing
      if (!user && (isDevMockAuth || token.startsWith('dev-'))) {
        user = await User.create({
          firebaseUid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name || 'Test User',
          enrollmentNumber: token === 'dev-admin-uid' ? 'ADM-999' : 'ENR-2026-001',
          collegeName: 'State Institute of Technology',
          branch: token === 'dev-admin-uid' ? 'Administration' : 'Computer Science',
          semester: token === 'dev-admin-uid' ? 8 : 4,
          role: token === 'dev-admin-uid' ? 'admin' : 'student',
        });
      }
    } else {
      // Offline mock fallback user profile
      user = mockUsers.find(u => u.firebaseUid === decodedToken.uid);
      if (!user) {
        user = {
          _id: decodedToken.uid === 'dev-admin-uid' ? '60c72b2f9b1d8b22a07c91b2' : '60c72b2f9b1d8b22a07c91b1',
          firebaseUid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name || 'Academic Student',
          enrollmentNumber: decodedToken.uid === 'dev-admin-uid' ? 'ADM-999' : 'ENR-2026-001',
          collegeName: 'State Institute of Technology',
          branch: decodedToken.uid === 'dev-admin-uid' ? 'Administration' : 'Computer Science',
          semester: decodedToken.uid === 'dev-admin-uid' ? 8 : 4,
          role: decodedToken.uid === 'dev-admin-uid' ? 'admin' : 'student',
          profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80'
        };
      }
    }

    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server authentication error', error: error.message });
  }
};

// Protect routes - must be logged in with a valid MongoDB profile
export const protect = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User profile not synchronized or not found' });
  }
  next();
};

// Admin role check
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
  }
};
