import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FiMail, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return setError('Please enter your email address.');
    }
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await forgotPassword(email);
      setMessage('A password reset link has been dispatched to your inbox. Check spam if you do not see it shortly.');
      setEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 dark:bg-darkbg-200">
      <div className="w-full max-w-md">
        
        {/* Title */}
        <div className="text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-500 text-white shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-extrabold text-slate-900 dark:text-white">Password Recovery</h2>
          <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Enter email to receive a secure password override link
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-darkbg-100/50">
          
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3.5 text-xs font-bold text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
              <FiAlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3.5 text-xs font-bold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
              <FiCheckCircle className="h-4.5 w-4.5 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative mt-2">
                <FiMail className="absolute top-3.5 left-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu"
                  className="w-full rounded-xl border border-slate-200 py-3.5 pr-4 pl-11 text-sm bg-transparent outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-800 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Submit Trigger */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 py-3.5 text-sm font-bold text-white transition hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Sending link...' : 'Send Recovery Email'}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <p className="mt-8 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
          Remember credentials?{' '}
          <Link
            to="/login"
            className="font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
