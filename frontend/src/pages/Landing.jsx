import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { motion } from 'framer-motion';
import {
  FiFolder,
  FiAward,
  FiCreditCard,
  FiSearch,
  FiDownload,
  FiLock,
  FiMoon,
  FiSun,
  FiCheckCircle,
  FiArrowRight
} from 'react-icons/fi';

const Landing = () => {
  const { firebaseUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      title: 'Document Storage',
      desc: 'Organize Marksheets, Degrees, Certificates, and Identity Cards in categorized folders.',
      icon: FiFolder,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      title: 'Scholarship Manager',
      desc: 'Track applications and required verification papers with real-time progress status tags.',
      icon: FiAward,
      color: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Fee Receipt Vault',
      desc: 'Upload receipts and group them easily by Academic Year and Semester for immediate audits.',
      icon: FiCreditCard,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Smart Search',
      desc: 'Instantly retrieve files by name, type, academic term, or Category with quick filtering.',
      icon: FiSearch,
      color: 'from-purple-500 to-violet-500',
    },
    {
      title: 'One Click Print Packages',
      desc: 'Combine identity and academic credentials into a single consolidated PDF folder instantly.',
      icon: FiDownload,
      color: 'from-pink-500 to-rose-500',
    },
    {
      title: 'Secure Cloud Storage',
      desc: 'Bank-grade database structures and Firebase protection keep your records private.',
      icon: FiLock,
      color: 'from-cyan-500 to-blue-500',
    },
  ];

  const steps = [
    { number: '01', title: 'Create Account', desc: 'Register in seconds using Email or Google Sign-In.' },
    { number: '02', title: 'Upload Documents', desc: 'Securely upload PDFs or images directly from any device.' },
    { number: '03', title: 'Organize Categories', desc: 'File records into Academic, Scholarship, Personal, or Financial tabs.' },
    { number: '04', title: 'Download & Print', desc: 'Instantly download individual files or combine packages in one-click.' },
  ];

  const testimonials = [
    {
      name: 'Aditya Verma',
      role: 'B.Tech CS Student',
      quote: 'EduVault saved my life during placement season! Having all my marksheets, certificates, and college ID compiled in a secure place made application submissions instantaneous.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Sneha Reddy',
      role: 'Scholarship Recipient',
      quote: 'The Scholarship Manager made uploading income proofs and tracking application updates so simple. Being able to export my scholarship print package saved hours of paperwork.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-200 dark:bg-darkbg-200 dark:text-slate-100">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-darkbg-100/85">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-6">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 text-white shadow-md shadow-primary-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM22.5 10.5V7.5a3 3 0 00-3-3h-15a3 3 0 00-3 3v3h21z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-indigo-400">
              EduVault
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300 md:flex">
            <a href="#home" className="transition hover:text-primary-600 dark:hover:text-primary-400">Home</a>
            <a href="#features" className="transition hover:text-primary-600 dark:hover:text-primary-400">Features</a>
            <a href="#how-it-works" className="transition hover:text-primary-600 dark:hover:text-primary-400">How It Works</a>
            <a href="#about" className="transition hover:text-primary-600 dark:hover:text-primary-400">About</a>
            <a href="#contact" className="transition hover:text-primary-600 dark:hover:text-primary-400">Contact</a>
          </div>

          {/* CTA / Auth Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              {theme === 'light' ? <FiMoon className="h-5 w-5" /> : <FiSun className="h-5 w-5" />}
            </button>

            {firebaseUser ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-primary-700 shadow-md shadow-primary-500/20"
              >
                Go to Dashboard <FiArrowRight />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden text-sm font-bold text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 sm:inline"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:shadow-lg hover:shadow-primary-500/15"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="relative overflow-hidden px-6 pt-16 pb-20 md:pt-24 lg:pb-28">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/10 h-72 w-72 rounded-full bg-primary-400/10 blur-3xl dark:bg-primary-600/5"></div>
        <div className="absolute top-1/3 right-1/10 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-600/5"></div>

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 lg:flex-row">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3.5 py-1.5 text-xs font-bold text-primary-600 dark:bg-primary-950/30 dark:text-primary-400">
                <FiLock className="h-3.5 w-3.5" /> ISO 27001 Secure Document Storage
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
            >
              Store All Academic Documents in{' '}
              <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-indigo-400">
                One Secure Place
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-base leading-relaxed text-slate-500 dark:text-slate-400 sm:text-lg"
            >
              EduVault is a dedicated academic folder space designed for college students. Save, organize, preview, and download your marksheets, fee receipts, identity documents, and scholarship forms under one unified roof.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start"
            >
              <Link
                to={firebaseUser ? '/dashboard' : '/signup'}
                className="rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-primary-500/25 transition hover:shadow-xl hover:translate-y-[-1px] dark:shadow-primary-900/10"
              >
                Get Started Free
              </Link>
              <a
                href="#features"
                className="rounded-2xl border border-slate-200 bg-white px-8 py-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-darkbg-100 dark:text-slate-300 dark:hover:bg-slate-800/80"
              >
                Learn More
              </a>
            </motion.div>
          </div>

          {/* Hero Illustration */}
          <div className="flex-1 flex justify-center w-full max-w-md lg:max-w-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative w-full aspect-square rounded-3xl bg-gradient-to-tr from-primary-100/50 to-indigo-100/30 p-4 dark:from-primary-950/10 dark:to-indigo-950/5"
            >
              {/* Modern Graphic Grid mimicking digital vaults and files */}
              <div className="absolute inset-0 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 grid grid-cols-6 grid-rows-6 opacity-60"></div>
              
              {/* Floating ID Card mockup */}
              <div className="absolute top-[12%] left-[10%] w-[50%] h-[32%] rounded-2xl bg-white p-4 shadow-xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800 transition-transform duration-300 hover:scale-102 flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                    <FiFolder className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Academic Folder</h5>
                    <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">10th_marksheet.pdf</p>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-primary-500 rounded-full"></div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                  <span>Category: Academic</span>
                  <span className="text-emerald-500 flex items-center gap-0.5"><FiCheckCircle className="inline" /> Verified</span>
                </div>
              </div>

              {/* Floating Scholarship Card mockup */}
              <div className="absolute bottom-[16%] right-[10%] w-[54%] h-[30%] rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 p-4 shadow-2xl border border-white/5 flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[9px] uppercase font-semibold text-indigo-200">Scholarship status</p>
                    <h4 className="text-xs font-bold mt-0.5">Post-Matric Scheme</h4>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-extrabold text-emerald-400 border border-emerald-500/30">
                    Approved
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center text-indigo-300 text-xs">
                    <FiAward />
                  </div>
                  <span className="text-[10px] font-semibold text-indigo-200">All required documents attached</span>
                </div>
              </div>

              {/* Central Core Sphere */}
              <div className="absolute top-[40%] right-[22%] h-28 w-28 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-500 shadow-lg flex items-center justify-center text-white scale-90 md:scale-100">
                <FiLock className="h-10 w-10 animate-pulse" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20 md:py-28 border-t border-slate-100 dark:border-slate-900">
        <div className="text-center">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-primary-600 dark:text-primary-400">Everything you need</h2>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">Platform Features</h3>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
            A comprehensive web storage environment fine-tuned for college operations, document audits, and fast administrative printing.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="glass-card p-6 bg-white dark:bg-darkbg-100"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${feat.color} text-white shadow-md`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">{feat.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="bg-slate-100 py-20 dark:bg-darkbg-100/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-sans">Workflow</h2>
            <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">How EduVault Works</h3>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, idx) => (
              <div key={step.title} className="relative rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:bg-darkbg-100 dark:border-slate-800">
                <span className="absolute top-4 right-6 text-3xl font-black text-slate-100 dark:text-slate-800/80">
                  {step.number}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white pr-8">{step.title}</h4>
                <p className="mt-2.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          <div className="flex-1">
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-primary-600 dark:text-primary-400">Security First</h2>
            <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">Built for Student Peace of Mind</h3>
            <p className="mt-6 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Students generate dozens of documents during their academic lifecycle—enrollment slips, exam hall tickets, semester results, fee receipts, and scholarship compliance letters. Storing them in standard, unstructured clouds leads to misplaced records, missing details, and delay during placements.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              EduVault solves this by offering structural document categorization, scholarship tracking pipelines, and a smart print compiler that automatically pulls your personal papers (Aadhaar, income sheet, caste proof, bank passbook) into a single, print-ready PDF bundle.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Firebase Secured Access</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">100% Mobile Optimized</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Instant PDF Compiler</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Zero File Duplications</span>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full max-w-md bg-white p-6 rounded-2xl shadow-sm border border-slate-100 dark:bg-darkbg-100 dark:border-slate-800">
            <h4 className="text-sm font-extrabold text-slate-400 uppercase tracking-wide">Supported Documents</h4>
            <div className="mt-6 space-y-4">
              <div>
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300">Academic Folders</h5>
                <p className="text-[11px] text-slate-400 mt-1">10th Marksheet, 12th Marksheet, Semester Results, Degree Certificates</p>
              </div>
              <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300">Scholarship Verification</h5>
                <p className="text-[11px] text-slate-400 mt-1">Income Certificate, Caste proof, Domicile proof, Application logs</p>
              </div>
              <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300">Financial / Personal</h5>
                <p className="text-[11px] text-slate-400 mt-1">Aadhaar Card, PAN card, Fee receipts, Bank statement photo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="bg-slate-100 py-20 dark:bg-darkbg-100/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-primary-600 dark:text-primary-400">Reviews</h2>
            <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">What Students Say</h3>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {testimonials.map((test) => (
              <div key={test.name} className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:bg-darkbg-100 dark:border-slate-800 flex flex-col justify-between">
                <p className="text-sm italic leading-relaxed text-slate-600 dark:text-slate-300">
                  "{test.quote}"
                </p>
                <div className="mt-6 flex items-center gap-3.5">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-primary-100 dark:ring-primary-900/30"
                  />
                  <div>
                    <h5 className="text-sm font-extrabold text-slate-800 dark:text-white">{test.name}</h5>
                    <p className="text-xs text-slate-400">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="mx-auto max-w-4xl px-6 py-20 md:py-28 text-center">
        <h2 className="text-sm font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Support</h2>
        <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">Need Assistance?</h3>
        <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500 dark:text-slate-400">
          Have queries about document safety or want to register your college? Shoot our engineering team a support query.
        </p>
        <div className="mt-8 flex justify-center">
          <a
            href="mailto:support@eduvault.com"
            className="rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-primary-500/20 hover:shadow-lg"
          >
            Email Support: support@eduvault.com
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-white py-12 dark:border-slate-900 dark:bg-darkbg-100">
        <div className="mx-auto max-w-7xl px-6 flex flex-col justify-between gap-8 md:flex-row">
          
          {/* Logo & Description */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM22.5 10.5V7.5a3 3 0 00-3-3h-15a3 3 0 00-3 3v3h21z" />
                </svg>
              </div>
              <span className="font-bold text-slate-800 dark:text-white">EduVault</span>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-400">
              A premium, secure cloud storage platform optimized for managing student academic records, verification cards, and digital college ID credentials.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-12 text-xs">
            <div>
              <h5 className="font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Product</h5>
              <div className="mt-3.5 space-y-2 flex flex-col text-slate-400 font-semibold">
                <a href="#features" className="hover:text-primary-600">Features</a>
                <a href="#how-it-works" className="hover:text-primary-600">Workflow</a>
                <a href="#about" className="hover:text-primary-600">Security Details</a>
              </div>
            </div>
            <div>
              <h5 className="font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Security</h5>
              <div className="mt-3.5 space-y-2 flex flex-col text-slate-400 font-semibold">
                <span className="hover:text-primary-600">Data Encryption</span>
                <span className="hover:text-primary-600">Firebase Protection</span>
                <span className="hover:text-primary-600">Compliance Certification</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 mt-10 border-t border-slate-100 pt-6 text-center text-xs font-semibold text-slate-400 dark:border-slate-850">
          <p>© {new Date().getFullYear()} EduVault. Designed for secure student document compilation.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
