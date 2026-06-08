import express from 'express';
import { checkAuth, protect, adminOnly } from '../middleware/auth.js';
import User from '../models/User.js';
import Document from '../models/Document.js';
import Scholarship from '../models/Scholarship.js';
import FeeReceipt from '../models/FeeReceipt.js';
import { firebaseAdmin, isDevMockAuth } from '../config/firebase.js';
import mongoose from 'mongoose';
import { mockUsers, mockDocuments, mockScholarships, mockFeeReceipts } from '../config/mockStore.js';

const router = express.Router();

// Apply auth, login protection and admin authorization to all routes in this router
router.use(checkAuth, protect, adminOnly);

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
router.get('/analytics', async (req, res) => {
  try {
    // Database offline mode
    if (mongoose.connection.readyState !== 1) {
      const totalStudents = mockUsers.filter(u => u.role === 'student').length;
      const totalDocuments = mockDocuments.length;
      const totalStorageBytes = mockDocuments.reduce((acc, curr) => acc + (curr.fileSize || 0), 0);

      const categoryStats = mockDocuments.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + 1;
        return acc;
      }, {});

      const scholarshipStats = mockScholarships.reduce((acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      }, {});

      return res.status(200).json({
        totalStudents,
        totalDocuments,
        totalStorageBytes,
        categories: categoryStats,
        scholarships: scholarshipStats
      });
    }

    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalDocuments = await Document.countDocuments();
    
    // Sum storage space (in bytes)
    const storageStats = await Document.aggregate([
      { $group: { _id: null, totalBytes: { $sum: '$fileSize' } } }
    ]);
    const totalStorageBytes = storageStats.length > 0 ? storageStats[0].totalBytes : 0;

    // Document count by Category
    const categoryStats = await Document.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    // Scholarship count by Status
    const scholarshipStats = await Scholarship.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Format output
    const analytics = {
      totalStudents,
      totalDocuments,
      totalStorageBytes,
      categories: categoryStats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      scholarships: scholarshipStats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {})
    };

    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving analytics', error: error.message });
  }
});

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private/Admin
router.get('/students', async (req, res) => {
  try {
    const { search } = req.query;

    // Database offline mode
    if (mongoose.connection.readyState !== 1) {
      let list = mockUsers.filter(u => u.role === 'student');
      if (search) {
        const s = search.toLowerCase();
        list = list.filter(u => 
          u.name.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s) ||
          (u.enrollmentNumber && u.enrollmentNumber.toLowerCase().includes(s))
        );
      }
      return res.status(200).json(list);
    }
    
    const query = { role: 'student' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { enrollmentNumber: { $regex: search, $options: 'i' } },
        { collegeName: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await User.find(query).sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student directory', error: error.message });
  }
});

// @desc    Get all documents for a specific student
// @route   GET /api/admin/students/:id/documents
// @access  Private/Admin
router.get('/students/:id/documents', async (req, res) => {
  try {
    // Database offline mode
    if (mongoose.connection.readyState !== 1) {
      const student = mockUsers.find(u => String(u._id) === String(req.params.id));
      if (!student) {
        return res.status(404).json({ message: 'Student profile not found' });
      }
      const docs = mockDocuments.filter(d => String(d.userId) === String(student._id));
      return res.status(200).json({ student, documents: docs });
    }

    const student = await User.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const documents = await Document.find({ userId: student._id }).sort({ createdAt: -1 });
    res.status(200).json({ student, documents });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student documents', error: error.message });
  }
});

// @desc    Delete a student user and all associated documents & firebase registration
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', async (req, res) => {
  try {
    // Database offline mode
    if (mongoose.connection.readyState !== 1) {
      const idx = mockUsers.findIndex(u => String(u._id) === String(req.params.id));
      if (idx === -1) {
        return res.status(404).json({ message: 'User profile not found' });
      }

      const student = mockUsers[idx];
      if (student.role === 'admin') {
        return res.status(400).json({ message: 'Cannot delete administrator profiles' });
      }

      // Cascading clear mock arrays
      for (let i = mockDocuments.length - 1; i >= 0; i--) {
        if (String(mockDocuments[i].userId) === String(student._id)) {
          mockDocuments.splice(i, 1);
        }
      }
      for (let i = mockScholarships.length - 1; i >= 0; i--) {
        if (String(mockScholarships[i].userId) === String(student._id)) {
          mockScholarships.splice(i, 1);
        }
      }
      for (let i = mockFeeReceipts.length - 1; i >= 0; i--) {
        if (String(mockFeeReceipts[i].userId) === String(student._id)) {
          mockFeeReceipts.splice(i, 1);
        }
      }

      mockUsers.splice(idx, 1);
      return res.status(200).json({
        message: 'Student account and all associated records deleted successfully (Mock Mode)',
        id: student._id
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete administrator profiles' });
    }

    // 1. Find and Delete all files in Firebase Storage for this user
    const documents = await Document.find({ userId: user._id });
    
    if (!isDevMockAuth && firebaseAdmin && documents.length > 0) {
      try {
        const bucket = firebaseAdmin.storage().bucket();
        for (const doc of documents) {
          try {
            const file = bucket.file(doc.firebaseStoragePath);
            const [exists] = await file.exists();
            if (exists) {
              await file.delete();
            }
          } catch (storageError) {
            console.error(`Admin delete document storage error for path ${doc.firebaseStoragePath}: ${storageError.message}`);
          }
        }
      } catch (err) {
        console.error(`Admin delete storage process failed: ${err.message}`);
      }
    }

    // 2. Clear Database records (Documents, FeeReceipts, Scholarships)
    await Document.deleteMany({ userId: user._id });
    await Scholarship.deleteMany({ userId: user._id });
    await FeeReceipt.deleteMany({ userId: user._id });

    // 3. Delete user from Firebase Authentication
    if (!isDevMockAuth && firebaseAdmin) {
      try {
        await firebaseAdmin.auth().deleteUser(user.firebaseUid);
        console.log(`Successfully deleted Firebase Authentication record for: ${user.firebaseUid}`);
      } catch (authError) {
        console.error(`Firebase Auth account delete failed: ${authError.message}`);
      }
    }

    // 4. Delete user record in MongoDB
    await User.deleteOne({ _id: user._id });

    res.status(200).json({
      message: 'Student account and all associated records deleted successfully',
      id: user._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user account', error: error.message });
  }
});

export default router;
