import express from 'express';
import { checkAuth, protect } from '../middleware/auth.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { mockUsers } from '../config/mockStore.js';

const router = express.Router();

// Apply auth middleware to all user routes
router.use(checkAuth, protect);

// @desc    Get current user profile
// @route   GET /api/user/profile
// @access  Private
router.get('/profile', async (req, res) => {
  res.status(200).json(req.user);
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
router.put('/profile', async (req, res) => {
  try {
    // Database offline mode
    if (mongoose.connection.readyState !== 1) {
      const user = mockUsers.find(u => String(u._id) === String(req.user._id));
      if (user) {
        user.name = req.body.name || user.name;
        user.enrollmentNumber = req.body.enrollmentNumber !== undefined ? req.body.enrollmentNumber : user.enrollmentNumber;
        user.collegeName = req.body.collegeName !== undefined ? req.body.collegeName : user.collegeName;
        user.branch = req.body.branch !== undefined ? req.body.branch : user.branch;
        user.semester = req.body.semester !== undefined ? req.body.semester : user.semester;
        user.phoneNumber = req.body.phoneNumber !== undefined ? req.body.phoneNumber : user.phoneNumber;
        user.profilePhoto = req.body.profilePhoto !== undefined ? req.body.profilePhoto : user.profilePhoto;
        
        return res.status(200).json({
          message: 'Profile updated successfully (Mock Mode)',
          user,
        });
      }
      
      // Temporary simulated updates
      req.user.name = req.body.name || req.user.name;
      req.user.enrollmentNumber = req.body.enrollmentNumber !== undefined ? req.body.enrollmentNumber : req.user.enrollmentNumber;
      req.user.collegeName = req.body.collegeName !== undefined ? req.body.collegeName : req.user.collegeName;
      req.user.branch = req.body.branch !== undefined ? req.body.branch : req.user.branch;
      req.user.semester = req.body.semester !== undefined ? req.body.semester : req.user.semester;
      req.user.phoneNumber = req.body.phoneNumber !== undefined ? req.body.phoneNumber : req.user.phoneNumber;
      req.user.profilePhoto = req.body.profilePhoto !== undefined ? req.body.profilePhoto : req.user.profilePhoto;

      return res.status(200).json({
        message: 'Profile updated successfully (Mock Mode)',
        user: req.user,
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update allowable fields
    user.name = req.body.name || user.name;
    user.enrollmentNumber = req.body.enrollmentNumber !== undefined ? req.body.enrollmentNumber : user.enrollmentNumber;
    user.collegeName = req.body.collegeName !== undefined ? req.body.collegeName : user.collegeName;
    user.branch = req.body.branch !== undefined ? req.body.branch : user.branch;
    user.semester = req.body.semester !== undefined ? req.body.semester : user.semester;
    user.phoneNumber = req.body.phoneNumber !== undefined ? req.body.phoneNumber : user.phoneNumber;
    user.profilePhoto = req.body.profilePhoto !== undefined ? req.body.profilePhoto : user.profilePhoto;

    const updatedUser = await user.save();
    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

export default router;
