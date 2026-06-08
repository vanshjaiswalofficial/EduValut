import express from 'express';
import { checkAuth, protect } from '../middleware/auth.js';
import Document from '../models/Document.js';
import { firebaseAdmin, isDevMockAuth } from '../config/firebase.js';
import mongoose from 'mongoose';
import { mockDocuments } from '../config/mockStore.js';

const router = express.Router();

router.use(checkAuth, protect);

// @desc    Register a new uploaded document
// @route   POST /api/documents
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, url, firebaseStoragePath, fileType, category, subCategory, fileSize } = req.body;

    if (!name || !url || !firebaseStoragePath || !fileType || !category || !subCategory || !fileSize) {
      return res.status(400).json({ message: 'All file metadata fields are required' });
    }

    // Database offline mode
    if (mongoose.connection.readyState !== 1) {
      const mockDoc = {
        _id: new mongoose.Types.ObjectId().toString(),
        userId: req.user._id,
        name,
        url,
        firebaseStoragePath,
        fileType: fileType.toLowerCase(),
        category,
        subCategory,
        fileSize,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockDocuments.unshift(mockDoc);
      return res.status(201).json({
        message: 'Document registered successfully (Mock Mode)',
        document: mockDoc,
      });
    }

    const document = new Document({
      userId: req.user._id,
      name,
      url,
      firebaseStoragePath,
      fileType: fileType.toLowerCase(),
      category,
      subCategory,
      fileSize,
    });

    const savedDoc = await document.save();
    res.status(201).json({
      message: 'Document registered successfully',
      document: savedDoc,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering document', error: error.message });
  }
});

// @desc    Get all documents for the logged-in user
// @route   GET /api/documents
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { category, search, sortBy } = req.query;

    // Database offline mode
    if (mongoose.connection.readyState !== 1) {
      let docs = mockDocuments.filter(d => String(d.userId) === String(req.user._id));
      
      if (category && category !== 'All') {
        docs = docs.filter(d => d.category === category);
      }
      
      if (search) {
        const s = search.toLowerCase();
        docs = docs.filter(d => d.name.toLowerCase().includes(s) || d.subCategory.toLowerCase().includes(s));
      }

      if (sortBy === 'oldest') {
        docs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (sortBy === 'name-asc') {
        docs.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === 'name-desc') {
        docs.sort((a, b) => b.name.localeCompare(a.name));
      } else if (sortBy === 'size-desc') {
        docs.sort((a, b) => b.fileSize - a.fileSize);
      } else if (sortBy === 'size-asc') {
        docs.sort((a, b) => a.fileSize - b.fileSize);
      } else {
        docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      return res.status(200).json(docs);
    }
    
    // Base query
    const query = { userId: req.user._id };

    // Filter by Category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search query (matches name or subCategory)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { subCategory: { $regex: search, $options: 'i' } },
      ];
    }

    // Sorting options (default to newest first)
    let sortOptions = { createdAt: -1 };
    if (sortBy === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sortBy === 'name-asc') {
      sortOptions = { name: 1 };
    } else if (sortBy === 'name-desc') {
      sortOptions = { name: -1 };
    } else if (sortBy === 'size-asc') {
      sortOptions = { fileSize: 1 };
    } else if (sortBy === 'size-desc') {
      sortOptions = { fileSize: -1 };
    }

    const documents = await Document.find(query).sort(sortOptions);
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents', error: error.message });
  }
});

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    // Database offline mode
    if (mongoose.connection.readyState !== 1) {
      const idx = mockDocuments.findIndex(d => String(d._id) === String(req.params.id) && String(d.userId) === String(req.user._id));
      if (idx === -1) {
        return res.status(404).json({ message: 'Document not found or unauthorized' });
      }
      mockDocuments.splice(idx, 1);
      return res.status(200).json({ message: 'Document deleted successfully (Mock Mode)', id: req.params.id });
    }

    const document = await Document.findOne({ _id: req.params.id, userId: req.user._id });

    if (!document) {
      return res.status(404).json({ message: 'Document not found or unauthorized' });
    }

    // Try deleting file from Firebase Storage
    if (!isDevMockAuth && firebaseAdmin) {
      try {
        const bucket = firebaseAdmin.storage().bucket();
        const file = bucket.file(document.firebaseStoragePath);
        
        // Check if file exists in bucket before deleting to avoid crash
        const [exists] = await file.exists();
        if (exists) {
          await file.delete();
          console.log(`Successfully deleted storage file: ${document.firebaseStoragePath}`);
        }
      } catch (storageError) {
        console.error(`Firebase Storage deletion warning: ${storageError.message}`);
        // Continue to delete from MongoDB even if storage deletion fails
      }
    }

    await Document.deleteOne({ _id: document._id });
    res.status(200).json({ message: 'Document deleted successfully', id: document._id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document', error: error.message });
  }
});

export default router;
