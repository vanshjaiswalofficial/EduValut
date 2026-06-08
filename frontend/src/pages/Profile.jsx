import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { FiEdit3, FiUser, FiInfo, FiHash, FiBookOpen, FiPhone, FiMail, FiX, FiCheckCircle } from 'react-icons/fi';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Edit fields state
  const [name, setName] = useState(user?.name || '');
  const [enrollmentNumber, setEnrollmentNumber] = useState(user?.enrollmentNumber || '');
  const [collegeName, setCollegeName] = useState(user?.collegeName || '');
  const [branch, setBranch] = useState(user?.branch || '');
  const [semester, setSemester] = useState(user?.semester || 1);
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || '');

  const openEditModal = () => {
    setName(user?.name || '');
    setEnrollmentNumber(user?.enrollmentNumber || '');
    setCollegeName(user?.collegeName || '');
    setBranch(user?.branch || '');
    setSemester(user?.semester || 1);
    setPhoneNumber(user?.phoneNumber || '');
    setProfilePhoto(user?.profilePhoto || '');
    setError('');
    setSuccess(false);
    setModalOpen(true);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name || !collegeName || !enrollmentNumber) {
      return setError('Please enter name, college, and enrollment number.');
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await updateProfile({
        name,
        enrollmentNumber,
        collegeName,
        branch,
        semester: Number(semester),
        phoneNumber,
        profilePhoto
      });
      setSuccess(true);
      setTimeout(() => setModalOpen(false), 1200);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200">Digital Identity Card</h2>
          <p className="text-xs text-slate-400 font-semibold">Your structural college ID badge and demographic profile</p>
        </div>
        <button
          onClick={openEditModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md"
        >
          <FiEdit3 className="h-4 w-4" /> Edit Profile
        </button>
      </div>

      <div className="flex flex-col items-center justify-center py-6">
        
        {/* DIGITAL COLLEGE ID CARD */}
        <div className="relative w-full max-w-sm aspect-[1.58/1] rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100 dark:bg-slate-900 dark:border-slate-800 id-grid-bg transition-transform duration-300 hover:scale-101">
          {/* Holographic Security Overlay Strip */}
          <div className="absolute top-0 right-0 left-0 h-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-500 dark:to-indigo-500"></div>
          
          {/* Logo badge in header */}
          <div className="p-4.5 flex justify-between items-start">
            <div>
              <h3 className="text-sm font-black text-slate-850 dark:text-white leading-none tracking-tight">STUDENT IDENTITY CARD</h3>
              <p className="text-[9px] text-primary-600 dark:text-primary-400 font-black mt-1 uppercase tracking-wider">{user?.collegeName || 'State Institute of Technology'}</p>
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary-600 text-white text-[10px] font-bold">
              EV
            </div>
          </div>

          {/* User Image and Core info */}
          <div className="px-4.5 flex gap-4">
            {/* ID Card Portrait */}
            <div className="h-28 w-24 rounded-2xl bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 overflow-hidden flex-shrink-0 flex items-center justify-center">
              {user?.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt="Student portrait"
                  className="h-full w-full object-cover"
                />
              ) : (
                <FiUser className="h-10 w-10 text-slate-350 dark:text-slate-700" />
              )}
            </div>

            {/* Fields list */}
            <div className="flex-1 space-y-1.5 min-w-0">
              <div>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Full Name</span>
                <p className="text-xs font-black text-slate-850 dark:text-white truncate leading-normal">{user?.name || 'Syncing...'}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Enrollment</span>
                  <p className="text-[10px] font-black text-slate-800 dark:text-slate-200 truncate">{user?.enrollmentNumber || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Branch</span>
                  <p className="text-[10px] font-black text-slate-800 dark:text-slate-200 truncate">{user?.branch || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Semester</span>
                  <p className="text-[10px] font-black text-slate-800 dark:text-slate-200">Term {user?.semester || 1}</p>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Role Status</span>
                  <p className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 uppercase">
                    Active
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Barcode representation at bottom */}
          <div className="absolute bottom-3 left-4.5 right-4.5 flex justify-between items-end border-t border-dashed border-slate-100 pt-2.5 dark:border-slate-800">
            {/* Simulated lines */}
            <div className="h-6 w-36 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 opacity-20 flex" style={{ WebkitMaskImage: 'repeating-linear-gradient(90deg, black, black 2px, transparent 2px, transparent 5px)' }}></div>
            <span className="text-[8px] font-bold text-slate-400 font-mono tracking-wider">SECURE ID {user?.firebaseUid?.substring(0, 8).toUpperCase()}</span>
          </div>
        </div>

      </div>

      {/* EDIT PROFILE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-darkbg-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Update Profile details</h4>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg">
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4 py-4 overflow-y-auto pr-1 flex-1 custom-scrollbar">
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-600 dark:bg-rose-950/20 dark:text-rose-450">
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450">
                  <FiCheckCircle className="h-4 w-4" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-xs bg-transparent outline-none focus:border-primary-500 dark:border-slate-800 dark:text-white"
                  required
                />
              </div>

              {/* College */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">College Name</label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-xs bg-transparent outline-none focus:border-primary-500 dark:border-slate-800 dark:text-white"
                  required
                />
              </div>

              {/* Enrollment & Branch */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Enrollment Number</label>
                  <input
                    type="text"
                    value={enrollmentNumber}
                    onChange={(e) => setEnrollmentNumber(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-xs bg-transparent outline-none focus:border-primary-500 dark:border-slate-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Branch</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-xs bg-transparent outline-none focus:border-primary-500 dark:border-slate-800 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Semester & Phone */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-xs bg-white dark:bg-slate-900 outline-none focus:border-primary-500 dark:border-slate-800 dark:text-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-xs bg-transparent outline-none focus:border-primary-500 dark:border-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Profile image URL */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Profile Photo URL</label>
                <input
                  type="url"
                  value={profilePhoto}
                  onChange={(e) => setProfilePhoto(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-xs bg-transparent outline-none focus:border-primary-500 dark:border-slate-800 dark:text-white"
                />
              </div>
            </form>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-white dark:bg-darkbg-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={loading}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:border-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleProfileSubmit}
                disabled={loading}
                className="rounded-xl bg-primary-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-700 shadow"
              >
                {loading ? 'Saving Changes...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
