import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { Link } from 'react-router-dom';
import { FiFile, FiDatabase, FiAward, FiClock, FiPlus, FiArrowRight, FiFileText } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDocs: 0,
    storageUsed: '0 KB',
    recentDocs: [],
    pendingScholarships: 0,
    feeReceiptsCount: 0
  });
  const [loading, setLoading] = useState(true);

  // Formatter for Bytes to Human-Readable formats
  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch files, scholarships, and receipts
        const [docsRes, scholRes, receiptsRes] = await Promise.all([
          api.get('/documents'),
          api.get('/scholarship'),
          api.get('/feeReceipt')
        ]);

        const documents = docsRes.data;
        const scholarships = scholRes.data;
        const receipts = receiptsRes.data;

        // Calculate statistics
        const totalSize = documents.reduce((acc, curr) => acc + (curr.fileSize || 0), 0);
        const pendingSchols = scholarships.filter(s => s.status === 'Pending' || s.status === 'Submitted').length;

        setStats({
          totalDocs: documents.length,
          storageUsed: formatBytes(totalSize),
          recentDocs: documents.slice(0, 5), // top 5
          pendingScholarships: pendingSchols,
          feeReceiptsCount: receipts.length
        });
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Compiling statistics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-indigo-600 p-6 text-white shadow-lg shadow-primary-500/10">
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-xl"></div>
        <div className="relative z-10">
          <h2 className="text-xl font-extrabold md:text-2xl">Welcome Back, {user?.name?.split(' ')[0] || 'Student'}! 👋</h2>
          <p className="mt-1.5 text-xs font-semibold text-primary-100">
            {user?.collegeName || 'State Institute of Technology'} &bull; Semester {user?.semester || 1} &bull; {user?.branch || 'General'}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Documents */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-darkbg-100/50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Documents</span>
            <h3 className="mt-1.5 text-2xl font-black text-slate-800 dark:text-slate-100">{stats.totalDocs}</h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
            <FiFile className="h-5 w-5" />
          </div>
        </div>

        {/* Space Occupied */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-darkbg-100/50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Storage Used</span>
            <h3 className="mt-1.5 text-2xl font-black text-slate-800 dark:text-slate-100">{stats.storageUsed}</h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
            <FiDatabase className="h-5 w-5" />
          </div>
        </div>

        {/* Active Scholarships */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-darkbg-100/50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Scholarships</span>
            <h3 className="mt-1.5 text-2xl font-black text-slate-800 dark:text-slate-100">{stats.pendingScholarships}</h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400">
            <FiAward className="h-5 w-5" />
          </div>
        </div>

        {/* Receipts Logged */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-darkbg-100/50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fee Receipts</span>
            <h3 className="mt-1.5 text-2xl font-black text-slate-800 dark:text-slate-100">{stats.feeReceiptsCount}</h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
            <FiFileText className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Left Column: Recent Documents */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-darkbg-100/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Recent Uploads</h4>
              <Link to="/documents" className="text-xs font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-0.5">
                View All <FiArrowRight className="inline" />
              </Link>
            </div>
            
            {stats.recentDocs.length === 0 ? (
              <div className="my-10 flex flex-col items-center justify-center text-center">
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900 text-slate-400">
                  <FiClock className="h-8 w-8" />
                </div>
                <p className="mt-3 text-xs font-bold text-slate-400">No uploads recorded yet.</p>
                <Link to="/upload" className="mt-4 text-xs font-extrabold text-primary-600 hover:underline">Upload your first document</Link>
              </div>
            ) : (
              <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800/80">
                {stats.recentDocs.map((doc) => (
                  <div key={doc._id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 dark:bg-slate-900/60 flex-shrink-0">
                        {doc.fileType === 'pdf' ? (
                          <svg className="h-5.5 w-5.5 text-rose-500 fill-current" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                          </svg>
                        ) : (
                          <svg className="h-5.5 w-5.5 text-blue-500 fill-current" viewBox="0 0 24 24">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                          </svg>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="truncate text-xs font-bold text-slate-850 dark:text-slate-200" title={doc.name}>{doc.name}</p>
                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{doc.category} &bull; {formatBytes(doc.fileSize)}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Checklist / Actions */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-darkbg-100/50 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Quick Actions</h4>
            <p className="text-xs text-slate-400 font-semibold mt-1">Common academic operations shortcuts</p>
            
            <div className="mt-5 space-y-3">
              <Link
                to="/upload"
                className="flex items-center gap-3 rounded-xl border border-dashed border-slate-250 p-3 hover:bg-slate-50 transition dark:border-slate-800 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/20 dark:text-primary-400">
                  <FiPlus className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold">Upload Document</h5>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Store PDFs or images securely</p>
                </div>
              </Link>

              <Link
                to="/print-center"
                className="flex items-center gap-3 rounded-xl border border-dashed border-slate-250 p-3 hover:bg-slate-50 transition dark:border-slate-800 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
                  <FiFileText className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold">Print Center Packages</h5>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Combine documents into one PDF</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="border-t border-slate-100 pt-4 dark:border-slate-800/80 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active System: Firebase Vault</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
