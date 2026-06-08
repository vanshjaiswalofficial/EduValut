import express from 'express';
import { checkAuth, protect } from '../middleware/auth.js';
import Scholarship from '../models/Scholarship.js';
import mongoose from 'mongoose';
import { mockScholarships, mockDocuments } from '../config/mockStore.js';

const router = express.Router();

router.use(checkAuth, protect);

// @desc    Add a scholarship application
// @route   POST /api/scholarship
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, provider, amount, status, applicationDate, documents, remarks } = req.body;

    if (!name || !provider || amount === undefined) {
      return res.status(400).json({ message: 'Name, provider, and amount are required' });
    }

    // Database offline mode
    if (mongoose.connection.readyState !== 1) {
      const matchedDocs = (documents || []).map(id => mockDocuments.find(d => String(d._id) === String(id))).filter(Boolean);
      const mockSch = {
        _id: new mongoose.Types.ObjectId().toString(),
        userId: req.user._id,
        name,
        provider,
        amount,
        status: status || 'Pending',
        applicationDate: applicationDate || Date.now(),
        documents: matchedDocs,
        remarks: remarks || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockScholarships.unshift(mockSch);
      return res.status(201).json(mockSch);
    }

    const scholarship = new Scholarship({
      userId: req.user._id,
      name,
      provider,
      amount,
      status: status || 'Pending',
      applicationDate: applicationDate || Date.now(),
      documents: documents || [],
      remarks: remarks || '',
    });

    const savedScholarship = await scholarship.save();
    res.status(201).json(savedScholarship);
  } catch (error) {
    res.status(500).json({ message: 'Error adding scholarship', error: error.message });
  }
});

// @desc    Get all scholarship applications for logged-in user
// @route   GET /api/scholarship
// @access  Private
router.get('/', async (req, res) => {
  try {
    // Database offline mode
    if (mongoose.connection.readyState !== 1) {
      const userSchols = mockScholarships.filter(s => String(s.userId) === String(req.user._id));
      
      // Sync document populations dynamically from mockDocuments
      userSchols.forEach(sch => {
        if (sch.documents) {
          sch.documents = sch.documents.map(d => {
            const docIdStr = typeof d === 'object' ? String(d._id) : String(d);
            return mockDocuments.find(doc => String(doc._id) === docIdStr) || d;
          });
        }
      });
      return res.status(200).json(userSchols);
    }

    const scholarships = await Scholarship.find({ userId: req.user._id })
      .populate('documents')
      .sort({ createdAt: -1 });
    res.status(200).json(scholarships);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching scholarships', error: error.message });
  }
});

// @desc    Update a scholarship application
// @route   PUT /api/scholarship/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    // Database offline mode
    if (mongoose.connection.readyState !== 1) {
      const sch = mockScholarships.find(s => String(s._id) === String(req.params.id) && String(s.userId) === String(req.user._id));
      if (!sch) {
        return res.status(404).json({ message: 'Scholarship application not found' });
      }

      sch.name = req.body.name || sch.name;
      sch.provider = req.body.provider || sch.provider;
      sch.amount = req.body.amount !== undefined ? req.body.amount : sch.amount;
      sch.status = req.body.status || sch.status;
      sch.applicationDate = req.body.applicationDate || sch.applicationDate;
      sch.remarks = req.body.remarks !== undefined ? req.body.remarks : sch.remarks;
      
      if (req.body.documents) {
        sch.documents = req.body.documents.map(id => mockDocuments.find(d => String(d._id) === String(id))).filter(Boolean);
      }
      
      return res.status(200).json(sch);
    }

    const scholarship = await Scholarship.findOne({ _id: req.params.id, userId: req.user._id });

    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship application not found' });
    }

    // Update fields
    scholarship.name = req.body.name || scholarship.name;
    scholarship.provider = req.body.provider || scholarship.provider;
    scholarship.amount = req.body.amount !== undefined ? req.body.amount : scholarship.amount;
    scholarship.status = req.body.status || scholarship.status;
    scholarship.applicationDate = req.body.applicationDate || scholarship.applicationDate;
    scholarship.documents = req.body.documents || scholarship.documents;
    scholarship.remarks = req.body.remarks !== undefined ? req.body.remarks : scholarship.remarks;

    const updated = await scholarship.save();
    
    // Send populated version back
    const populated = await Scholarship.findById(updated._id).populate('documents');
    res.status(200).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating scholarship', error: error.message });
  }
});

// @desc    Delete a scholarship application
// @route   DELETE /api/scholarship/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    // Database offline mode
    if (mongoose.connection.readyState !== 1) {
      const idx = mockScholarships.findIndex(s => String(s._id) === String(req.params.id) && String(s.userId) === String(req.user._id));
      if (idx === -1) {
        return res.status(404).json({ message: 'Scholarship application not found' });
      }
      mockScholarships.splice(idx, 1);
      return res.status(200).json({ message: 'Scholarship application deleted successfully (Mock Mode)', id: req.params.id });
    }

    const scholarship = await Scholarship.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship application not found' });
    }

    res.status(200).json({ message: 'Scholarship application deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting scholarship', error: error.message });
  }
});

export default router;
