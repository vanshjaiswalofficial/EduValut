import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { FiPlus, FiEdit, FiTrash2, FiAward, FiBookmark, FiDollarSign, FiPaperclip, FiX, FiCheck } from 'react-icons/fi';

const ScholarshipManager = () => {
  const [scholarships, setScholarships] = useState([]);
  const [userDocs, setUserDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('Pending');
  const [remarks, setRemarks] = useState('');
  const [selectedDocIds, setSelectedDocIds] = useState([]);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const [schRes, docRes] = await Promise.all([
        api.get('/scholarship'),
        api.get('/documents')
      ]);
      setScholarships(schRes.data);
      setUserDocs(docRes.data);
    } catch (err) {
      console.error('Failed to retrieve scholarships data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setProvider('');
    setAmount('');
    setStatus('Pending');
    setRemarks('');
    setSelectedDocIds([]);
    setModalOpen(true);
  };

  const openEditModal = (sch) => {
    setEditingId(sch._id);
    setName(sch.name);
    setProvider(sch.provider);
    setAmount(sch.amount);
    setStatus(sch.status);
    setRemarks(sch.remarks || '');
    setSelectedDocIds(sch.documents?.map(d => d._id) || []);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this scholarship application?')) return;
    try {
      await api.delete(`/scholarship/${id}`);
      setScholarships(scholarships.filter(s => s._id !== id));
    } catch (err) {
      console.error('Error deleting scholarship', err);
    }
  };

  const handleDocToggle = (docId) => {
    if (selectedDocIds.includes(docId)) {
      setSelectedDocIds(selectedDocIds.filter(id => id !== docId));
    } else {
      setSelectedDocIds([...selectedDocIds, docId]);
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!name || !provider || amount === '') return;

    const payload = {
      name,
      provider,
      amount: Number(amount),
      status,
      remarks,
      documents: selectedDocIds
    };

    try {
      if (editingId) {
        const res = await api.put(`/scholarship/${editingId}`, payload);
        setScholarships(scholarships.map(s => s._id === editingId ? res.data : s));
      } else {
        const res = await api.post('/scholarship', payload);
        // Re-fetch because response isn't fully populated with documents from DB ref
        fetchScholarships();
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Failed to submit scholarship information', err);
    }
  };

  const getStatusBadge = (stat) => {
    const maps = {
      Pending: 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-500/20',
      Submitted: 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-500/20',
      Approved: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-500/20',
      Rejected: 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-500/20',
    };
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${maps[stat] || 'bg-slate-50'}`}>
        {stat}
      </span>
    );
  };

  // Metrics calculators
  const totalAppliedAmount = scholarships.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalApprovedAmount = scholarships
    .filter(s => s.status === 'Approved')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200">Scholarship Manager</h2>
          <p className="text-xs text-slate-400 font-semibold">Track external funding schemes, grant documents, and statuses</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-primary-500/15"
        >
          <FiPlus className="h-4.5 w-4.5" /> Add Scholarship
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-4.5 shadow-sm dark:border-slate-800 dark:bg-darkbg-100/50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Applications</span>
            <h3 className="mt-1 text-xl font-black text-slate-800 dark:text-slate-100">{scholarships.length}</h3>
          </div>
          <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
            <FiBookmark />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4.5 shadow-sm dark:border-slate-800 dark:bg-darkbg-100/50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Requested Funds</span>
            <h3 className="mt-1 text-xl font-black text-slate-800 dark:text-slate-100">₹{totalAppliedAmount.toLocaleString()}</h3>
          </div>
          <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
            <FiDollarSign />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4.5 shadow-sm dark:border-slate-800 dark:bg-darkbg-100/50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Approved Funding</span>
            <h3 className="mt-1 text-xl font-black text-emerald-600 dark:text-emerald-400">₹{totalApprovedAmount.toLocaleString()}</h3>
          </div>
          <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
            <FiDollarSign />
          </div>
        </div>
      </div>

      {/* Grid of Scholarships */}
      {loading ? (
        <div className="flex h-[30vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : scholarships.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-darkbg-100/30">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 dark:bg-slate-900">
            <FiAward className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-700 dark:text-slate-200">No scholarships logged</h3>
          <p className="mx-auto mt-2 max-w-sm text-xs text-slate-400 font-semibold">
            Track external student funding schemes. Link documents to verify submissions.
          </p>
          <button
            onClick={openAddModal}
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-primary-50 px-4 py-2.5 text-xs font-bold text-primary-600 hover:bg-primary-100 dark:bg-primary-950/30 dark:text-primary-400"
          >
            Add Scholarship <FiPlus />
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {scholarships.map((sch) => (
            <div
              key={sch._id}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-850 dark:bg-darkbg-100/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-slate-855 dark:text-slate-200">{sch.name}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Provider: {sch.provider}</p>
                  </div>
                  {getStatusBadge(sch.status)}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-xs font-semibold py-2.5 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl px-3 border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400">Funding Amount</span>
                    <p className="text-slate-800 dark:text-slate-200 mt-0.5">₹{sch.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Applied Date</span>
                    <p className="text-slate-800 dark:text-slate-200 mt-0.5">{new Date(sch.applicationDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Associated documents list */}
                <div className="mt-4 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Attached Verification Docs</span>
                  {sch.documents?.length === 0 ? (
                    <p className="text-[10px] text-slate-400 italic">No files linked to this program.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {sch.documents?.map((doc) => (
                        <a
                          key={doc._id}
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                        >
                          <FiPaperclip className="h-3 w-3" />
                          <span className="truncate max-w-[120px]" title={doc.name}>{doc.name}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {sch.remarks && (
                  <div className="mt-4 p-2.5 rounded-xl border border-slate-100/50 bg-slate-50/30 dark:border-slate-850 dark:bg-slate-900/20">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Remarks</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-450 leading-relaxed mt-0.5">{sch.remarks}</p>
                  </div>
                )}
              </div>

              {/* Card Footer actions */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-850 flex justify-end gap-2.5">
                <button
                  onClick={() => openEditModal(sch)}
                  className="rounded-lg p-2 text-slate-500 border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 flex items-center gap-1.5 text-xs font-bold"
                >
                  <FiEdit className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(sch._id)}
                  className="rounded-lg p-2 text-rose-600 border border-rose-100 hover:bg-rose-50 dark:border-rose-950/20 dark:hover:bg-rose-950/50 flex items-center gap-1.5 text-xs font-bold"
                >
                  <FiTrash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT SCHOLARSHIP MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-darkbg-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {editingId ? 'Edit Scholarship scheme' : 'Log Scholarship application'}
              </h4>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg">
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4 py-4 overflow-y-auto pr-1 flex-1 custom-scrollbar">
              {/* Scheme Name */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Scholarship Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Post-Matric Scholarship Scheme"
                  className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-xs bg-transparent outline-none focus:border-primary-500 dark:border-slate-800 dark:text-white"
                  required
                />
              </div>

              {/* Provider */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Funding Provider / Authority</label>
                <input
                  type="text"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="Ministry of Minority Affairs"
                  className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-xs bg-transparent outline-none focus:border-primary-500 dark:border-slate-800 dark:text-white"
                  required
                />
              </div>

              {/* Amount and Status */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Grant Amount (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="25000"
                    className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-xs bg-transparent outline-none focus:border-primary-500 dark:border-slate-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Processing Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-xs bg-white dark:bg-slate-900 outline-none focus:border-primary-500 dark:border-slate-800 dark:text-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Remarks / Notes</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Need to submit verification letter to CS department by Friday."
                  rows={2}
                  className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-xs bg-transparent outline-none focus:border-primary-500 dark:border-slate-800 dark:text-white"
                />
              </div>

              {/* Document Checkbox link options */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Associate Vault Documents</label>
                {userDocs.length === 0 ? (
                  <p className="text-[10px] text-slate-400 italic">No files available to link. Go to document vault to upload files first.</p>
                ) : (
                  <div className="max-h-36 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-100 dark:border-slate-800 dark:divide-slate-800 custom-scrollbar p-1.5">
                    {userDocs.map(doc => {
                      const checked = selectedDocIds.includes(doc._id);
                      return (
                        <div
                          key={doc._id}
                          onClick={() => handleDocToggle(doc._id)}
                          className="flex items-center justify-between py-2 px-2 hover:bg-slate-50 dark:hover:bg-slate-900/60 rounded-lg cursor-pointer"
                        >
                          <div className="flex items-center gap-2 overflow-hidden pr-2">
                            <FiPaperclip className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                            <span className="truncate text-xs font-medium text-slate-700 dark:text-slate-350" title={doc.name}>{doc.name}</span>
                          </div>
                          <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition-all ${
                            checked ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-300 dark:border-slate-700'
                          }`}>
                            {checked && <FiCheck className="h-3 w-3" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </form>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-white dark:bg-darkbg-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:border-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                className="rounded-xl bg-primary-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-700 shadow shadow-primary-500/10"
              >
                Save Scheme Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ScholarshipManager;
