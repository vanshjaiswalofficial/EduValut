import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { FiUsers, FiFile, FiDatabase, FiSearch, FiFolder, FiTrash2, FiX, FiDownload, FiAlertTriangle, FiArrowRight } from 'react-icons/fi';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Selected student documents modal states
  const [inspectStudent, setInspectStudent] = useState(null);
  const [studentDocs, setStudentDocs] = useState([]);
  const [inspectLoading, setInspectLoading] = useState(false);

  // User delete modal states
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, studentsRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/students', { params: { search } })
      ]);
      setAnalytics(analyticsRes.data);
      setStudents(studentsRes.data);
    } catch (err) {
      console.error('Failed to load administrative analytics data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchAdminData();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleInspectStudent = async (student) => {
    setInspectStudent(student);
    setInspectLoading(true);
    try {
      const res = await api.get(`/admin/students/${student._id}/documents`);
      setStudentDocs(res.data.documents);
    } catch (err) {
      console.error('Error fetching student files', err);
    } finally {
      setInspectLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    setIsDeleting(true);
    try {
      await api.delete(`/admin/users/${deleteConfirmUser._id}`);
      setStudents(students.filter(s => s._id !== deleteConfirmUser._id));
      setDeleteConfirmUser(null);
      // Reload analytics metrics
      const analyticsRes = await api.get('/admin/analytics');
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error('Failed to delete student account', err);
      alert(err.response?.data?.message || err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  if (loading && !analytics) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200">Administration Console</h2>
        <p className="text-xs text-slate-400 font-semibold">Track system metrics, audit uploaded student credentials, and manage roles</p>
      </div>

      {/* Analytics metrics row */}
      {analytics && (
        <div className="grid gap-5 sm:grid-cols-3">
          
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-darkbg-100/50 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Enrolled Students</span>
              <h3 className="mt-1.5 text-2xl font-black text-slate-800 dark:text-slate-100">{analytics.totalStudents}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450">
              <FiUsers className="h-5.5 w-5.5" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-darkbg-100/50 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Files Logged</span>
              <h3 className="mt-1.5 text-2xl font-black text-slate-800 dark:text-slate-100">{analytics.totalDocuments}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
              <FiFile className="h-5.5 w-5.5" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-darkbg-100/50 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Storage Occupied</span>
              <h3 className="mt-1.5 text-2xl font-black text-slate-800 dark:text-slate-100">{formatBytes(analytics.totalStorageBytes)}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
              <FiDatabase className="h-5.5 w-5.5" />
            </div>
          </div>

        </div>
      )}

      {/* Categories Distribution visual bar charts */}
      {analytics && (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-darkbg-100/50 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Storage Categories Distribution</h3>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-1.5">
            {['Academic', 'Scholarship', 'Financial', 'Personal'].map((cat) => {
              const count = analytics.categories[cat] || 0;
              const total = analytics.totalDocuments || 1;
              const percent = Math.round((count / total) * 100);

              const colorClass = 
                cat === 'Academic' ? 'bg-blue-500' :
                cat === 'Scholarship' ? 'bg-amber-500' :
                cat === 'Financial' ? 'bg-emerald-500' : 'bg-purple-500';

              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600 dark:text-slate-350">{cat} Folder</span>
                    <span className="text-slate-400">{count} files ({percent}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${colorClass} rounded-full`} style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Roster & Search */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Registered Student Roster</h3>
          <div className="relative w-full max-w-xs">
            <FiSearch className="absolute top-3 left-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, enrollment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 pr-4 pl-10 text-xs bg-transparent outline-none focus:border-emerald-500 dark:border-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-darkbg-100/50">
          <table className="w-full border-collapse text-left text-xs text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 font-bold text-slate-400 dark:bg-slate-900/60 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Enrollment Number</th>
                <th className="p-4">Branch & Semester</th>
                <th className="p-4">Contact</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-805/85 font-medium">
              {students.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400 italic">No student profiles match query filters.</td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                    <td className="p-4 flex items-center gap-3">
                      {student.profilePhoto ? (
                        <img src={student.profilePhoto} alt="Student" className="h-9 w-9 rounded-xl object-cover" />
                      ) : (
                        <div className="h-9 w-9 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500 dark:bg-slate-900">
                          {student.name.split(' ').map(n=>n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-850 dark:text-slate-200">{student.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{student.collegeName}</p>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-500 dark:text-slate-450">{student.enrollmentNumber || 'N/A'}</td>
                    <td className="p-4">
                      <p className="text-slate-800 dark:text-slate-300 font-semibold">{student.branch || 'N/A'}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Semester {student.semester}</p>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <p className="text-slate-500 dark:text-slate-450">{student.email}</p>
                      <p className="text-[10px] text-slate-400">{student.phoneNumber || 'N/A'}</p>
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-2.5">
                      <button
                        onClick={() => handleInspectStudent(student)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850 inline-flex items-center gap-1 font-bold text-[10px]"
                        title="Audit Student Documents"
                      >
                        <FiFolder className="h-3.5 w-3.5" /> Inspect Files
                      </button>
                      <button
                        onClick={() => setDeleteConfirmUser(student)}
                        className="rounded-lg border border-rose-100 p-2 text-rose-600 hover:bg-rose-50 dark:border-rose-955/20 dark:hover:bg-rose-955/40 inline-flex items-center"
                        title="Purge student profile"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECT DOCUMENTS MODAL */}
      {inspectStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-darkbg-100 overflow-hidden flex flex-col max-h-[85vh]">
            
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-slate-805 dark:text-slate-200">
                  Documents Registry: {inspectStudent.name}
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Inspect and audit documents uploaded by {inspectStudent.email}</p>
              </div>
              <button onClick={() => setInspectStudent(null)} className="p-1 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg">
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Documents List */}
            <div className="flex-1 overflow-y-auto py-4 pr-1 custom-scrollbar">
              {inspectLoading ? (
                <div className="flex h-[200px] items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
                </div>
              ) : studentDocs.length === 0 ? (
                <div className="text-center py-12 text-slate-400 italic">No document registries uploaded by this student yet.</div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {studentDocs.map((doc) => (
                    <div key={doc._id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 dark:bg-slate-900 flex-shrink-0">
                          {doc.fileType === 'pdf' ? (
                            <svg className="h-5 w-5 text-rose-500 fill-current" viewBox="0 0 24 24">
                              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                            </svg>
                          ) : (
                            <svg className="h-5 w-5 text-blue-500 fill-current" viewBox="0 0 24 24">
                              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                            </svg>
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200" title={doc.name}>{doc.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{doc.category} &bull; {doc.subCategory} &bull; {formatBytes(doc.fileSize)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 pr-2">{new Date(doc.createdAt).toLocaleDateString()}</span>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850 inline-flex items-center"
                        >
                          <FiDownload className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-white dark:bg-darkbg-100">
              <button
                type="button"
                onClick={() => setInspectStudent(null)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:border-slate-800"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PURGE STUDENT CONFIRMATION MODAL */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-darkbg-100">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
              <FiAlertTriangle className="h-6 w-6" />
            </div>
            <h4 className="mt-4 text-center text-base font-bold text-slate-805 dark:text-slate-100">Purge Student Account?</h4>
            <p className="mt-2 text-center text-xs leading-relaxed text-slate-400 font-semibold">
              Warning: You are attempting to purge student account <span className="font-bold text-slate-700 dark:text-slate-200">"{deleteConfirmUser.name}" ({deleteConfirmUser.email})</span>.
              This cascading delete will permanently wipe their user database record, Firebase credentials, and erase all uploaded files from Cloud Storage!
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteConfirmUser(null)}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteUser}
                className="flex-1 rounded-xl bg-rose-600 py-3 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {isDeleting ? 'Purging account...' : 'Yes, Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
