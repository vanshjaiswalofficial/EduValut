import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FiMail, FiLock, FiUser, FiInfo, FiHash, FiBookOpen, FiPhone, FiAlertCircle, FiArrowRight, FiArrowLeft } from 'react-icons/fi';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');

  const nextStep = () => {
    if (step === 1) {
      if (!name || !email || !password) {
        return setError('Please fill in name, email, and password.');
      }
      if (password.length < 6) {
        return setError('Password must be at least 6 characters.');
      }
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!collegeName || !enrollmentNumber || !branch) {
      return setError('Please enter college, enrollment number, and branch.');
    }
    
    setError('');
    setLoading(true);

    try {
      const extraProfile = {
        enrollmentNumber,
        collegeName,
        branch,
        semester: Number(semester),
        phoneNumber,
        role: 'student' // default
      };

      await signup(name, email, password, extraProfile);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 dark:bg-darkbg-200">
      {/* Background glow effects */}
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-primary-500/5 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-indigo-500/5 blur-3xl"></div>

      <div className="w-full max-w-lg">
        
        {/* Header Title */}
        <div className="text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-500 text-white shadow-md shadow-primary-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM22.5 10.5V7.5a3 3 0 00-3-3h-15a3 3 0 00-3 3v3h21z" />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">Create Student Account</h2>
          <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            {step === 1 ? 'Step 1 of 2: Profile Settings' : 'Step 2 of 2: College Identity Details'}
          </p>
        </div>

        {/* Progress Bar indicator */}
        <div className="mt-6 flex gap-2">
          <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
          <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
        </div>

        {/* Form Card */}
        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-darkbg-100/50">
          
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3.5 text-xs font-bold text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
              <FiAlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* STEP 1: CREDENTIALS */}
            {step === 1 && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
                  <div className="relative mt-2">
                    <FiUser className="absolute top-3.5 left-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl border border-slate-200 py-3.5 pr-4 pl-11 text-sm bg-transparent outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-800 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
                  <div className="relative mt-2">
                    <FiMail className="absolute top-3.5 left-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane.doe@college.edu"
                      className="w-full rounded-xl border border-slate-200 py-3.5 pr-4 pl-11 text-sm bg-transparent outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-800 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password</label>
                  <div className="relative mt-2">
                    <FiLock className="absolute top-3.5 left-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="•••••••• (Min 6 chars)"
                      className="w-full rounded-xl border border-slate-200 py-3.5 pr-4 pl-11 text-sm bg-transparent outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-800 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Action button: Next */}
                <button
                  type="button"
                  onClick={nextStep}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 py-3.5 text-sm font-bold text-white transition hover:shadow-lg"
                >
                  Continue to Academic Profile <FiArrowRight />
                </button>
              </>
            )}

            {/* STEP 2: ACADEMIC DETAILS */}
            {step === 2 && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  
                  {/* College Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">College / University Name</label>
                    <div className="relative mt-2">
                      <FiInfo className="absolute top-3.5 left-4 text-slate-400 dark:text-slate-500" />
                      <input
                        type="text"
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        placeholder="State Institute of Technology"
                        className="w-full rounded-xl border border-slate-200 py-3.5 pr-4 pl-11 text-sm bg-transparent outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-800 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Enrollment Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Enrollment Number</label>
                    <div className="relative mt-2">
                      <FiHash className="absolute top-3.5 left-4 text-slate-400 dark:text-slate-500" />
                      <input
                        type="text"
                        value={enrollmentNumber}
                        onChange={(e) => setEnrollmentNumber(e.target.value)}
                        placeholder="ENR-2026-981"
                        className="w-full rounded-xl border border-slate-200 py-3.5 pr-4 pl-11 text-sm bg-transparent outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-800 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Branch */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Branch / Stream</label>
                    <div className="relative mt-2">
                      <FiBookOpen className="absolute top-3.5 left-4 text-slate-400 dark:text-slate-500" />
                      <input
                        type="text"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        placeholder="Computer Science"
                        className="w-full rounded-xl border border-slate-200 py-3.5 pr-4 pl-11 text-sm bg-transparent outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-800 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Semester */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current Semester</label>
                    <div className="mt-2">
                      <select
                        value={semester}
                        onChange={(e) => setSemester(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 p-3.5 text-sm bg-white dark:bg-slate-900 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-800 dark:text-white"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                          <option key={sem} value={sem}>Semester {sem}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone Number</label>
                    <div className="relative mt-2">
                      <FiPhone className="absolute top-3.5 left-4 text-slate-400 dark:text-slate-500" />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full rounded-xl border border-slate-200 py-3.5 pr-4 pl-11 text-sm bg-transparent outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                </div>

                {/* Back / Register triggers */}
                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-250 px-4 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-800"
                  >
                    <FiArrowLeft /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 py-3.5 text-sm font-bold text-white transition hover:shadow-lg disabled:opacity-50"
                  >
                    {loading ? 'Creating Account...' : 'Complete Register'}
                  </button>
                </div>
              </>
            )}

          </form>
        </div>

        {/* Footer Redirect */}
        <p className="mt-8 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
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

export default Signup;
