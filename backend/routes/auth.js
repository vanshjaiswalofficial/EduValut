import express from 'express';
import { checkAuth } from '../middleware/auth.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { mockUsers } from '../config/mockStore.js';

const router = express.Router();

// @desc    Sync Firebase User with MongoDB User
// @route   POST /api/auth/sync
// @access  Protected (via Firebase Token)
router.post('/sync', checkAuth, async (req, res) => {
  try {
    const { uid, email, name, picture } = req.firebaseUser;

    // Database offline mode
    if (mongoose.connection.readyState !== 1) {
      const user = mockUsers.find(u => u.firebaseUid === uid) || {
        _id: uid === 'dev-admin-uid' ? '60c72b2f9b1d8b22a07c91b2' : '60c72b2f9b1d8b22a07c91b1',
        firebaseUid: uid,
        email: email,
        name: name || req.body.name || 'Student',
        enrollmentNumber: uid === 'dev-admin-uid' ? 'ADM-999' : 'ENR-2026-001',
        collegeName: 'State Institute of Technology',
        branch: uid === 'dev-admin-uid' ? 'Administration' : 'Computer Science',
        semester: uid === 'dev-admin-uid' ? 8 : 4,
        role: uid === 'dev-admin-uid' ? 'admin' : 'student',
        profilePhoto: picture || req.body.profilePhoto || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return res.status(200).json({
        message: 'User synchronized successfully (Mock Mode)',
        user,
      });
    }
    
    let user = await User.findOne({ firebaseUid: uid });
    
    if (!user) {
      // Create a new User record in MongoDB using properties provided in the body
      const {
        enrollmentNumber,
        collegeName,
        branch,
        semester,
        phoneNumber,
        role
      } = req.body;

      user = new User({
        firebaseUid: uid,
        email: email,
        name: name || req.body.name || 'Student',
        enrollmentNumber: enrollmentNumber || '',
        collegeName: collegeName || '',
        branch: branch || '',
        semester: semester || 1,
        phoneNumber: phoneNumber || '',
        profilePhoto: picture || req.body.profilePhoto || '',
        role: role || 'student', // If seeded as admin or provided via code
      });

      await user.save();
      return res.status(201).json({
        message: 'User synchronized and profile created successfully',
        user,
      });
    }

    // Return existing user
    res.status(200).json({
      message: 'User synchronized successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Sync error', error: error.message });
  }
});

export default router;
