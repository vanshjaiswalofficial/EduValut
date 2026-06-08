import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { storage, isDemoMode } from '../services/firebase.js';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import api from '../services/api.js';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiCheckCircle, FiFileText, FiInfo, FiAlertCircle } from 'react-icons/fi';
import confetti from 'canvas-confetti';

const UploadDocument = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('Academic');
  const [subCategory, setSubCategory] = useState('10th Marksheet');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Subcategory mappings depending on main category selections
  const subCategoryMap = {
    Academic: ['10th Marksheet', '12th Marksheet', 'Semester Results', 'Degree Certificate'],
    Scholarship: ['Income Certificate', 'Caste Certificate', 'Domicile Certificate', 'Scholarship Forms'],
    Financial: ['Fee Receipts', 'Bank Passbook'],
    Personal: ['Aadhaar Card', 'PAN Card', 'Passport Photo'],
  };

  const handleCategoryChange = (e) => {
    const selectedCat = e.target.value;
    setCategory(selectedCat);
    setSubCategory(subCategoryMap[selectedCat][0]);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate size (limit to 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      setFile(null);
      return;
    }

    // Validate extension
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Only PDF, PNG, JPG, and JPEG file types are supported.');
      setFile(null);
      return;
    }

    setError('');
    setFile(selectedFile);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      return setError('Please select a valid document to upload.');
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError('');
    setSuccess(false);

    const fileType = file.name.split('.').pop().toLowerCase();
    const storagePath = `users/${user._id}/${category}/${Date.now()}_${file.name}`;

    if (isDemoMode) {
      // 1. Sandbox Simulated Upload Progress
      let progress = 0;
      const interval = setInterval(async () => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          try {
            // Mock documents download links
            const mockUrl = fileType === 'pdf' 
              ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
              : 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80';

            const payload = {
              name: file.name,
              url: mockUrl,
              firebaseStoragePath: storagePath,
              fileType,
              category,
              subCategory,
              fileSize: file.size,
            };

            // Register in database
            await api.post('/documents', payload);
            
            setSuccess(true);
            setIsUploading(false);
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 } });
            
            setTimeout(() => navigate('/documents'), 1500);
          } catch (err) {
            setError(err.response?.data?.message || err.message);
            setIsUploading(false);
          }
        }
      }, 150);
    } else {
      // 2. Real Live Firebase Storage Upload
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
        },
        (err) => {
          setError(`Firebase Storage error: ${err.message}`);
          setIsUploading(false);
        },
        async () => {
          try {
            // Retrieve URL and save details to MongoDB
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            
            const payload = {
              name: file.name,
              url: downloadUrl,
              firebaseStoragePath: storagePath,
              fileType,
              category,
              subCategory,
              fileSize: file.size,
            };

            await api.post('/documents', payload);
            
            setSuccess(true);
            setIsUploading(false);
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 } });
            
            setTimeout(() => navigate('/documents'), 1500);
          } catch (dbErr) {
            setError(dbErr.response?.data?.message || dbErr.message);
            setIsUploading(false);
          }
        }
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200">Upload Academic Document</h2>
        <p className="text-xs text-slate-400 font-semibold">Store new receipts, marksheets, or credentials securely</p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-darkbg-100/50">
        
        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-xs font-bold text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
            <FiAlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-bold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
            <FiCheckCircle className="h-4.5 w-4.5 flex-shrink-0" />
            <span>Upload successful! Redirecting to Document vault...</span>
          </div>
        )}

        <form onSubmit={handleUploadSubmit} className="space-y-5">
          
          {/* File Selector Box */}
          <div className="relative">
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 z-10 h-full w-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-8 bg-slate-50/50 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/10 dark:hover:bg-slate-900/30 transition-colors">
              <FiUploadCloud className="h-10 w-10 text-primary-500 mb-4" />
              {file ? (
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{file.name}</p>
                  <p className="text-xs text-slate-400 font-semibold mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div className="text-center space-y-1">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Drag & drop files or click to browse</p>
                  <p className="text-[11px] text-slate-400 font-semibold">Supports PDF, PNG, JPG & JPEG (Max 10MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* Category selection */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Document Category</label>
              <div className="mt-2">
                <select
                  value={category}
                  onChange={handleCategoryChange}
                  disabled={isUploading}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm bg-white dark:bg-slate-900 outline-none transition focus:border-primary-500 dark:border-slate-800 dark:text-white"
                >
                  <option value="Academic">Academic Folder</option>
                  <option value="Scholarship">Scholarship Docs</option>
                  <option value="Financial">Financial / Fees</option>
                  <option value="Personal">Personal Identity</option>
                </select>
              </div>
            </div>

            {/* Sub Category Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">File Sub-Category</label>
              <div className="mt-2">
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  disabled={isUploading}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm bg-white dark:bg-slate-900 outline-none transition focus:border-primary-500 dark:border-slate-800 dark:text-white"
                >
                  {subCategoryMap[category].map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                <span>Uploading to Vault...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-600 to-indigo-600 transition-all duration-150 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/documents')}
              disabled={isUploading}
              className="flex-1 py-3 text-sm font-bold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !file}
              className="flex-2 py-3 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-indigo-600 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              Confirm Upload
            </button>
          </div>

        </form>

      </div>

      <div className="rounded-2xl border border-slate-150/60 bg-slate-50 p-4 text-[11px] font-semibold text-slate-400 flex gap-2 dark:bg-slate-900/10 dark:border-slate-850">
        <FiInfo className="h-4.5 w-4.5 text-primary-500 flex-shrink-0" />
        <p>Your documents are protected using transport layer TLS encryption and verified in MongoDB. Once uploaded, files can be selected in the Print Package wizard or matched with scholarship forms.</p>
      </div>

    </div>
  );
};

export default UploadDocument;
