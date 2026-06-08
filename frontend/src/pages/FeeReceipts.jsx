import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { storage, isDemoMode } from '../services/firebase.js';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import api from '../services/api.js';
import { FiPlus, FiCreditCard, FiDownload, FiTrash2, FiClock, FiFileText, FiAlertCircle, FiX, FiCheck } from 'react-icons/fi';
import confetti from 'canvas-confetti';

const FeeReceipts = () => {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [semester, setSemester] = useState(1);
  const [amount, setAmount] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [file, setFile] = useState(null);
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/feeReceipt');
      setReceipts(res.data);
    } catch (err) {
      console.error('Failed to load receipts list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (selected.size > 5 * 1024 * 1024) {
      setError('Receipt size limit is 5MB.');
      setFile(null);
      return;
    }
    setError('');
    setFile(selected);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file || !amount || !receiptNumber || !academicYear) {
      return setError('Please fill in all receipt details and select a receipt file.');
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError('');

    const fileType = file.name.split('.').pop().toLowerCase();
    const storagePath = `users/${user._id}/Financial/Receipts/${Date.now()}_${file.name}`;

    const triggerSaveReceipt = async (url) => {
      try {
        const payload = {
          academicYear,
          semester: Number(semester),
          amount: Number(amount),
          paymentDate: paymentDate || new Date().toISOString().split('T')[0],
          receiptNumber,
          // document properties
          name: `Fee Receipt - Sem ${semester} (${academicYear}) - ${receiptNumber}.${fileType}`,
          url,
          firebaseStoragePath: storagePath,
          fileType,
          fileSize: file.size,
        };

        const res = await api.post('/feeReceipt', payload);
        
        // Success
        setReceipts([res.data.feeReceipt, ...receipts]);
        setModalOpen(false);
        setFile(null);
        setAmount('');
        setReceiptNumber('');
        setPaymentDate('');
        confetti({ particleCount: 50, spread: 40 });
        fetchReceipts(); // reload list fully populated
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsUploading(false);
      }
    };

    if (isDemoMode) {
      // simulated sandbox upload
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          const mockUrl = fileType === 'pdf'
            ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
            : 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80';
          triggerSaveReceipt(mockUrl);
        }
      }, 100);
    } else {
      // Firebase Live storage upload
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snap) => {
          const prog = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          setUploadProgress(prog);
        },
        (err) => {
          setError(`Firebase Storage error: ${err.message}`);
          setIsUploading(false);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          triggerSaveReceipt(downloadUrl);
        }
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fee receipt and its document?')) return;
    try {
      await api.delete(`/feeReceipt/${id}`);
      setReceipts(receipts.filter(r => r._id !== id));
    } catch (err) {
      console.error('Error deleting receipt', err);
    }
  };

  const totalFeesPaid = receipts.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200">Fee Receipt Vault</h2>
          <p className="text-xs text-slate-400 font-semibold">Organize university tuition slips, bills, and payment records</p>
        </div>
        <button
          onClick={() => {
            setError('');
            setModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-primary-500/15"
        >
          <FiPlus className="h-4.5 w-4.5" /> Upload Receipt
        </button>
      </div>

      {/* Aggregate metrics */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-darkbg-100/50 flex items-center justify-between max-w-md">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Academic Fees Paid</span>
          <h3 className="mt-1.5 text-2xl font-black text-slate-850 dark:text-white">₹{totalFeesPaid.toLocaleString()}</h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
          <FiCreditCard className="h-5.5 w-5.5" />
        </div>
      </div>

      {/* Receipts Table List */}
      {loading ? (
        <div className="flex h-[30vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : receipts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-darkbg-100/30">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 dark:bg-slate-900">
            <FiCreditCard className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-700 dark:text-slate-200">No receipts uploaded</h3>
          <p className="mx-auto mt-2 max-w-sm text-xs text-slate-400 font-semibold">
            Store and audit tuition invoices and payment records by Academic Year and Semester.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-primary-50 px-4 py-2.5 text-xs font-bold text-primary-600 hover:bg-primary-100 dark:bg-primary-950/30 dark:text-primary-400"
          >
            Upload Receipt <FiPlus />
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-darkbg-100/50">
          <table className="w-full border-collapse text-left text-xs text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 font-bold text-slate-400 dark:bg-slate-900/60 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-4">Academic Year</th>
                <th className="p-4">Semester</th>
                <th className="p-4">Receipt Number</th>
                <th className="p-4">Payment Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-805/80 font-medium">
              {receipts.map((rec) => (
                <tr key={rec._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                  <td className="p-4 text-slate-850 dark:text-slate-200 font-bold">{rec.academicYear}</td>
                  <td className="p-4">Semester {rec.semester}</td>
                  <td className="p-4 font-mono font-bold text-slate-500 dark:text-slate-400">{rec.receiptNumber}</td>
                  <td className="p-4">{new Date(rec.paymentDate).toLocaleDateString()}</td>
                  <td className="p-4 font-bold text-slate-800 dark:text-slate-200">₹{rec.amount.toLocaleString()}</td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    {rec.documentId?.url ? (
                      <a
                        href={rec.documentId.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850 inline-flex items-center gap-1 font-bold text-[10px]"
                        title="Download / View Receipt"
                      >
                        <FiDownload className="h-3.5 w-3.5" /> View
                      </a>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic mr-2">No file linked</span>
                    )}
                    <button
                      onClick={() => handleDelete(rec._id)}
                      className="rounded-lg border border-rose-100 p-2 text-rose-600 hover:bg-rose-50 dark:border-rose-950/20 dark:hover:bg-rose-950/40 inline-flex items-center"
                      title="Delete entry"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* UPLOAD RECEIPT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-darkbg-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Upload fee payment receipt</h4>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg">
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 py-4 overflow-y-auto pr-1 flex-1 custom-scrollbar">
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
                  <FiAlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* File input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Select Receipt File</label>
                <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/50 hover:bg-slate-50 text-center dark:border-slate-800 dark:bg-slate-900/20 dark:hover:bg-slate-900/40">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                    required
                  />
                  <FiFileText className="h-8 w-8 text-primary-500 mx-auto mb-2" />
                  {file ? (
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                  ) : (
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-450">Click to choose or drag slip</span>
                      <p className="text-[10px] text-slate-400">PDF, PNG, JPG (Max 5MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Academic Year and Semester */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Academic Year</label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    placeholder="2025-2026"
                    className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-xs bg-transparent outline-none focus:border-primary-500 dark:border-slate-800 dark:text-white"
                    required
                    disabled={isUploading}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Term / Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-xs bg-white dark:bg-slate-900 outline-none focus:border-primary-500 dark:border-slate-800 dark:text-white"
                    disabled={isUploading}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Amount and Receipt Number */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount Paid (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="45000"
                    className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-xs bg-transparent outline-none focus:border-primary-500 dark:border-slate-800 dark:text-white"
                    required
                    disabled={isUploading}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Receipt ID / Transaction No.</label>
                  <input
                    type="text"
                    value={receiptNumber}
                    onChange={(e) => setReceiptNumber(e.target.value)}
                    placeholder="REC-543219"
                    className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-xs bg-transparent outline-none focus:border-primary-500 dark:border-slate-800 dark:text-white"
                    required
                    disabled={isUploading}
                  />
                </div>
              </div>

              {/* Payment Date */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Payment Date</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-xs bg-white dark:bg-slate-900 outline-none focus:border-primary-500 dark:border-slate-800 dark:text-white"
                  disabled={isUploading}
                />
              </div>

              {/* Progress bar */}
              {isUploading && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>Uploading receipt...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-600 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}
            </form>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-white dark:bg-darkbg-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={isUploading}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:border-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadSubmit}
                disabled={isUploading || !file}
                className="rounded-xl bg-primary-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-700 shadow disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Confirm Payment Log'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FeeReceipts;
