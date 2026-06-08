import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import {
  FiSearch,
  FiFilter,
  FiArrowUp,
  FiArrowDown,
  FiFolder,
  FiEye,
  FiDownload,
  FiTrash2,
  FiPlus,
  FiX,
  FiInfo,
  FiAlertCircle
} from 'react-icons/fi';

const MyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Preview Modal state
  const [previewDoc, setPreviewDoc] = useState(null);
  const [deleteConfirmDoc, setDeleteConfirmDoc] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const categoriesList = ['All', 'Academic', 'Scholarship', 'Financial', 'Personal'];

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/documents', {
        params: {
          category,
          search,
          sortBy
        }
      });
      setDocuments(res.data);
    } catch (err) {
      console.error('Failed to retrieve documents directory', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce/Fetch on filters change
    const delayDebounce = setTimeout(() => {
      fetchDocuments();
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [category, search, sortBy]);

  const handleDelete = async () => {
    if (!deleteConfirmDoc) return;
    setIsDeleting(true);
    try {
      await api.delete(`/documents/${deleteConfirmDoc._id}`);
      setDocuments(documents.filter((d) => d._id !== deleteConfirmDoc._id));
      setDeleteConfirmDoc(null);
    } catch (err) {
      console.error('Error deleting document', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200">Documents Vault</h2>
          <p className="text-xs text-slate-400 font-semibold">Browse, search, audit, and organize your credentials</p>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-primary-500/15"
        >
          <FiPlus className="h-4.5 w-4.5" /> Upload File
        </Link>
      </div>

      {/* Search and Filters panel */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4.5 shadow-sm dark:border-slate-800 dark:bg-darkbg-100/50 space-y-4">
        
        {/* Search Input & Sorting */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <FiSearch className="absolute top-3.5 left-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search documents by name or subcategory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-3 pr-4 pl-11 text-xs bg-transparent outline-none transition focus:border-primary-500 dark:border-slate-800 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 whitespace-nowrap">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-200 p-3 text-xs bg-white dark:bg-slate-900 outline-none transition focus:border-primary-500 dark:border-slate-800 dark:text-white"
            >
              <option value="newest">Newest Uploads</option>
              <option value="oldest">Oldest Uploads</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="size-desc">Size (Large-Small)</option>
              <option value="size-asc">Size (Small-Large)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                category === cat
                  ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/10'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {cat === 'All' ? '📁 All Folders' : cat}
            </button>
          ))}
        </div>

      </div>

      {/* Document Directory Cards Grid */}
      {loading ? (
        <div className="flex h-[35vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
            <span className="text-xs text-slate-400">Loading catalog...</span>
          </div>
        </div>
      ) : documents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-darkbg-100/30">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 dark:bg-slate-900">
            <FiFolder className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-700 dark:text-slate-200">No documents found</h3>
          <p className="mx-auto mt-2 max-w-sm text-xs text-slate-400 font-semibold">
            We couldn't find any documents matching your current filters. Try adjusting your query or upload a file.
          </p>
          <Link
            to="/upload"
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-primary-50 px-4 py-2.5 text-xs font-bold text-primary-600 hover:bg-primary-100 dark:bg-primary-950/30 dark:text-primary-400"
          >
            Upload Document <FiPlus />
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {documents.map((doc) => {
            const isPdf = doc.fileType === 'pdf';
            return (
              <div
                key={doc._id}
                className="group relative rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md dark:border-slate-850 dark:bg-darkbg-100/50 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* File preview cover / icon */}
                  <div className="relative mb-3 flex h-28 w-full items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900/60 overflow-hidden">
                    {isPdf ? (
                      <div className="flex flex-col items-center gap-2">
                        <svg className="h-12 w-12 text-rose-500 fill-current" viewBox="0 0 24 24">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                        </svg>
                        <span className="rounded-lg bg-rose-50 px-2 py-0.5 text-[9px] font-black text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">PDF</span>
                      </div>
                    ) : (
                      // Render thumbnail
                      <img
                        src={doc.url}
                        alt={doc.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-103"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    {/* Hover actions overlay */}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2.5 transition-opacity">
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="rounded-lg bg-white/95 p-2 text-slate-800 hover:bg-white shadow"
                        title="Preview"
                      >
                        <FiEye className="h-4.5 w-4.5" />
                      </button>
                      <a
                        href={doc.url}
                        download={doc.name}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-white/95 p-2 text-slate-800 hover:bg-white shadow"
                        title="Download"
                      >
                        <FiDownload className="h-4.5 w-4.5" />
                      </a>
                      <button
                        onClick={() => setDeleteConfirmDoc(doc)}
                        className="rounded-lg bg-rose-600 p-2 text-white hover:bg-rose-700 shadow"
                        title="Delete"
                      >
                        <FiTrash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>

                  {/* Info details */}
                  <h4 className="truncate text-xs font-bold text-slate-850 dark:text-slate-200" title={doc.name}>
                    {doc.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">
                    {doc.subCategory}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                  <span>{formatBytes(doc.fileSize)}</span>
                  <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm">
          <div className="relative flex flex-col w-full max-w-4xl h-[85vh] rounded-2xl bg-white shadow-2xl dark:bg-darkbg-100 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-4">
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-lg">{previewDoc.name}</h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{previewDoc.category} &bull; {previewDoc.subCategory} &bull; {formatBytes(previewDoc.fileSize)}</p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            
            {/* Preview Frame */}
            <div className="flex-1 bg-slate-50 dark:bg-slate-900/60 p-4 flex items-center justify-center overflow-auto">
              {previewDoc.fileType === 'pdf' ? (
                <iframe
                  src={`${previewDoc.url}#toolbar=0`}
                  title={previewDoc.name}
                  className="h-full w-full rounded-lg border border-slate-100 dark:border-slate-850 bg-white"
                />
              ) : (
                <img
                  src={previewDoc.url}
                  alt={previewDoc.name}
                  className="max-h-full max-w-full rounded-lg object-contain shadow"
                />
              )}
            </div>

            {/* Actions Footer */}
            <div className="border-t border-slate-100 dark:border-slate-800 p-4 flex justify-end gap-3 bg-white dark:bg-darkbg-100">
              <button
                onClick={() => setPreviewDoc(null)}
                className="rounded-xl border border-slate-250 px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:border-slate-800"
              >
                Close
              </button>
              <a
                href={previewDoc.url}
                download={previewDoc.name}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-primary-600 px-5 py-2 text-xs font-bold text-white hover:bg-primary-750 shadow flex items-center gap-1.5"
              >
                <FiDownload /> Download File
              </a>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirmDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-darkbg-100">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
              <FiAlertCircle className="h-6 w-6" />
            </div>
            <h4 className="mt-4 text-center text-base font-bold text-slate-800 dark:text-slate-100">Delete Document?</h4>
            <p className="mt-2 text-center text-xs leading-relaxed text-slate-400 font-semibold">
              Are you sure you want to delete <span className="font-bold text-slate-700 dark:text-slate-200">"{deleteConfirmDoc.name}"</span>? This action is irreversible and will also purge the file from Cloud Storage.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteConfirmDoc(null)}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-rose-600 py-3 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyDocuments;
