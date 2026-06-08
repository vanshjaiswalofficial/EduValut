import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { isDemoMode } from '../services/firebase.js';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const { login, googleSignIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setError('Please enter both email and password.');
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.code === 'auth/invalid-credential' ? 'Invalid email or password.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await googleSignIn();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Demo auto-fill helpers
  const handleQuickLogin = async (role) => {
    const mockEmail = role === 'admin' ? 'admin@eduvault.com' : 'student@eduvault.com';
    setError('');
    setLoading(true);
    try {
      await login(mockEmail, 'bypass-mode');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 dark:bg-darkbg-200">
      
      {/* Outer Glows */}
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-primary-500/5 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-indigo-500/5 blur-3xl"></div>

      <div className="w-full max-w-md">
        
        {/* Logo and Greeting */}
        <div className="text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-500 text-white shadow-md shadow-primary-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM22.5 10.5V7.5a3 3 0 00-3-3h-15a3 3 0 00-3 3v3h21z" />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">Welcome Back</h2>
          <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Enter details to access your secure document vault
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-darkbg-100/50">
          
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3.5 text-xs font-bold text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
              <FiAlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isDemoMode && (
            <div className="mb-4 rounded-xl bg-amber-50 border border-amber-100/30 p-3.5 text-xs text-amber-800 dark:bg-amber-950/20 dark:text-amber-400">
              <span className="font-bold">Sandbox Mode Enabled</span>
              <p className="mt-1 font-semibold text-[11px]">Click a button below to bypass Firebase verification locally.</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('student')}
                  className="flex-1 rounded-lg bg-white px-2.5 py-1.5 border border-amber-200 text-[11px] font-extrabold text-amber-700 transition hover:bg-amber-50 dark:bg-slate-900 dark:border-slate-800 dark:text-amber-400 dark:hover:bg-slate-800"
                >
                  Demo Student
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="flex-1 rounded-lg bg-indigo-900 px-2.5 py-1.5 text-[11px] font-extrabold text-indigo-100 transition hover:bg-indigo-950"
                >
                  Demo Admin
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Input */}
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

            {/* Password Input */}
            <div>
              <div className="flex justify-between">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-350"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative mt-2">
                <FiLock className="absolute top-3.5 left-4 text-slate-400 dark:text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 py-3.5 pr-11 pl-11 text-sm bg-transparent outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-800 dark:text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-3.5 right-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                >
                  {showPassword ? <FiEyeOff className="h-4.5 w-4.5" /> : <FiEye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 py-3.5 text-sm font-bold text-white transition hover:shadow-lg hover:shadow-primary-500/15 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-slate-150 dark:border-slate-800"></div>
            <span className="absolute bg-white px-3 text-[10px] font-extrabold text-slate-400 dark:bg-darkbg-100 uppercase tracking-wide">Or connect with</span>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-850"
          >
            <FcGoogle className="h-5 w-5" />
            Continue with Google
          </button>
        </div>

        {/* Footer Link */}
        <p className="mt-8 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
