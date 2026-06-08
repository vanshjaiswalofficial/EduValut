import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { isDemoMode } from '../services/firebase.js';
import { FiSun, FiMoon, FiLock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { updatePassword as firebaseUpdatePassword } from 'firebase/auth';
import { auth } from '../services/firebase.js';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      return setError('Please fill in password fields.');
    }
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      if (isDemoMode) {
        // simulate
        await new Promise(resolve => setTimeout(resolve, 800));
      } else {
        if (auth.currentUser) {
          await firebaseUpdatePassword(auth.currentUser, newPassword);
        } else {
          throw new Error('No active authentication session.');
        }
      }
      setSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.code === 'auth/requires-recent-login'
        ? 'This operation requires recent authentication. Please sign out and sign back in to modify password.'
        : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200">Account Settings</h2>
        <p className="text-xs text-slate-400 font-semibold">Customize your theme preferences and security credentials</p>
      </div>

      {/* Theme preferences */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-darkbg-100/50 space-y-4">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Interface Theme</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          
          {/* Light Theme trigger */}
          <div
            onClick={() => { if (theme !== 'light') toggleTheme(); }}
            className={`flex items-center gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${
              theme === 'light'
                ? 'bg-primary-50 border-primary-350 text-primary-900 shadow-sm'
                : 'bg-slate-50/50 border-slate-100 dark:bg-slate-900/30 dark:border-slate-850 text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${theme === 'light' ? 'bg-primary-600 text-white shadow-sm' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
              <FiSun className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold">Light Theme</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Vibrant aesthetics for daylight</p>
            </div>
          </div>

          {/* Dark Theme trigger */}
          <div
            onClick={() => { if (theme !== 'dark') toggleTheme(); }}
            className={`flex items-center gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${
              theme === 'dark'
                ? 'bg-primary-50 border-primary-800/80 text-primary-100 dark:bg-primary-950/20'
                : 'bg-slate-50/50 border-slate-100 dark:bg-slate-900/30 dark:border-slate-850 text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-primary-600 text-white shadow-sm' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
              <FiMoon className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold">Dark Theme</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Sleek, low-contrast dark mode</p>
            </div>
          </div>

        </div>
      </div>

      {/* Change Password Panel */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-darkbg-100/50 space-y-4">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Override Password</h3>
        
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3.5 text-xs font-semibold text-rose-600 dark:bg-rose-950/20 dark:text-rose-450">
            <FiAlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450">
            <FiCheckCircle className="h-4.5 w-4.5 flex-shrink-0" />
            <span>Password updated successfully!</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-sm">
          
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-xs bg-transparent outline-none focus:border-primary-500 dark:border-slate-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-xs bg-transparent outline-none focus:border-primary-500 dark:border-slate-800 dark:text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !newPassword}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-primary-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-750 transition disabled:opacity-50"
          >
            <FiLock /> {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

    </div>
  );
};

export default Settings;
