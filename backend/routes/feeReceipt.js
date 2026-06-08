import express from 'express';
import { checkAuth, protect } from '../middleware/auth.js';
import FeeReceipt from '../models/FeeReceipt.js';
import Document from '../models/Document.js';
import { firebaseAdmin, isDevMockAuth } from '../config/firebase.js';
import mongoose from 'mongoose';
import { mockFeeReceipts, mockDocuments } from '../config/mockStore.js';

const router = express.Router();

router.use(checkAuth, protect);

// @desc    Upload fee receipt and save metadata
// @route   POST /api/feeReceipt
// @access  Private
router.post('/', async (req, res) => {
  try {
    const {
      academicYear,
      semester,
      amount,
      paymentDate,
      receiptNumber,
      // Underlying document metadata
      name,
      url,
      firebaseStoragePath,
      fileType,
      fileSize
    } = req.body;

    if (!academicYear || !semester || !amount || !receiptNumber || !name || !url || !firebaseStoragePath) {
      return res.status(400).json({ message: 'Missing required fee receipt or file metadata fields' });
    }

    // Database offline mode
    if (mongoose.connection.readyState !== 1) {
      const mockDoc = {
        _id: new mongoose.Types.ObjectId().toString(),
        userId: req.user._id,
        name,
        url,
        firebaseStoragePath,
        fileType: fileType ? fileType.toLowerCase() : 'pdf',
        category: 'Financial',
        subCategory: `Fee Receipt - Sem ${semester} (${academicYear})`,
        fileSize: fileSize || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockDocuments.unshift(mockDoc);

      const mockReceipt = {
        _id: new mongoose.Types.ObjectId().toString(),
        userId: req.user._id,
        documentId: mockDoc,
        academicYear,
        semester: Number(semester),
        amount: Number(amount),
        paymentDate: paymentDate || Date.now(),
        receiptNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockFeeReceipts.unshift(mockReceipt);

      return res.status(201).json({
        message: 'Fee receipt stored successfully (Mock Mode)',
        feeReceipt: mockReceipt,
        document: mockDoc
      });
    }

    // 1. Create the Document entity in database
    const document = new Document({
      userId: req.user._id,
      name,
      url,
      firebaseStoragePath,
      fileType: fileType ? fileType.toLowerCase() : 'pdf',
      category: 'Financial',
      subCategory: `Fee Receipt - Sem ${semester} (${academicYear})`,
      fileSize: fileSize || 0,
    });

    const savedDoc = await document.save();

    // 2. Create the FeeReceipt entity
    const feeReceipt = new FeeReceipt({
      userId: req.user._id,
      documentId: savedDoc._id,
      academicYear,
      semester,
      amount,
      paymentDate: paymentDate || Date.now(),
      receiptNumber,
    });

    const savedReceipt = await feeReceipt.save();
    
    res.status(201).json({
      message: 'Fee receipt stored successfully',
      feeReceipt: savedReceipt,
      document: savedDoc
    });
  } catch (error) {
    res.status(500).json({ message: 'Error storing fee receipt', error: error.message });
  }
});

// @desc    Get all fee receipts for logged-in user
// @route   GET /api/feeReceipt
// @access  Private
router.get('/', async (req, res) => {
  try {
    // Database offline mode
    if (mongoose.connection.readyState !== 1) {
      const userReceipts = mockFeeReceipts.filter(r => String(r.userId) === String(req.user._id));
      
      // Populate document details from mockDocuments
      userReceipts.forEach(rec => {
        const docIdStr = typeof rec.documentId === 'object' ? String(rec.documentId._id) : String(rec.documentId);
        rec.documentId = mockDocuments.find(d => String(d._id) === docIdStr) || rec.documentId;
      });
      return res.status(200).json(userReceipts);
    }

    const receipts = await FeeReceipt.find({ userId: req.user._id })
      .populate('documentId')
      .sort({ semester: 1, paymentDate: -1 });
    res.status(200).json(receipts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching fee receipts', error: error.message });
  }
});

// @desc    Delete fee receipt (cascading delete document & storage)
// @route   DELETE /api/feeReceipt/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    // Database offline mode
    if (mongoose.connection.readyState !== 1) {
      const idx = mockFeeReceipts.findIndex(r => String(r._id) === String(req.params.id) && String(r.userId) === String(req.user._id));
      if (idx === -1) {
        return res.status(404).json({ message: 'Fee receipt not found' });
      }

      const receipt = mockFeeReceipts[idx];
      const docIdStr = typeof receipt.documentId === 'object' ? String(receipt.documentId._id) : String(receipt.documentId);
      const docIdx = mockDocuments.findIndex(d => String(d._id) === docIdStr);
      if (docIdx !== -1) {
        mockDocuments.splice(docIdx, 1);
      }

      mockFeeReceipts.splice(idx, 1);
      return res.status(200).json({ message: 'Fee receipt deleted successfully (Mock Mode)', id: req.params.id });
    }

    const receipt = await FeeReceipt.findOne({ _id: req.params.id, userId: req.user._id });

    if (!receipt) {
      return res.status(404).json({ message: 'Fee receipt not found' });
    }

    // Retrieve corresponding document
    const document = await Document.findById(receipt.documentId);
    if (document) {
      // Delete from Firebase Storage
      if (!isDevMockAuth && firebaseAdmin) {
        try {
          const bucket = firebaseAdmin.storage().bucket();
          const file = bucket.file(document.firebaseStoragePath);
          const [exists] = await file.exists();
          if (exists) {
            await file.delete();
          }
        } catch (storageError) {
          console.error(`Firebase Storage deletion warning in feeReceipt: ${storageError.message}`);
        }
      }
      
      // Delete document metadata
      await Document.deleteOne({ _id: document._id });
    }

    // Delete fee receipt entry
    await FeeReceipt.deleteOne({ _id: receipt._id });
    res.status(200).json({ message: 'Fee receipt deleted successfully', id: receipt._id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting fee receipt', error: error.message });
  }
});

export default router;
