import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { FiSun, FiMoon, FiMenu, FiBell, FiChevronRight } from 'react-icons/fi';
import { useLocation, Link } from 'react-router-dom';

const Topbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Get human readable page name from path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard Overview';
    if (path === '/documents') return 'My Documents';
    if (path === '/upload') return 'Upload Document';
    if (path === '/scholarships') return 'Scholarship Manager';
    if (path === '/receipts') return 'Fee Receipt Vault';
    if (path === '/print-center') return 'One-Click Print Center';
    if (path === '/profile') return 'Student Profile';
    if (path === '/settings') return 'Preferences & Settings';
    if (path === '/admin') return 'Admin Dashboard';
    return 'EduVault';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white/80 px-6 backdrop-blur-md dark:border-slate-800/80 dark:bg-darkbg-100/80">
      {/* Mobile Toggle & Path Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 lg:hidden"
        >
          <FiMenu className="h-5 w-5" />
        </button>

        {/* Desktop Breadcrumbs */}
        <div className="hidden items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 md:flex">
          <Link to="/dashboard" className="hover:text-primary-600 dark:hover:text-primary-400">EduVault</Link>
          <FiChevronRight className="h-3 w-3" />
          <span className="text-slate-700 dark:text-slate-300">{getPageTitle()}</span>
        </div>

        {/* Mobile Title */}
        <h1 className="text-base font-bold text-slate-800 dark:text-slate-200 md:hidden">
          {getPageTitle()}
        </h1>
      </div>

      {/* Action Triggers */}
      <div className="flex items-center gap-3">
        {/* Dark/Light Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <FiMoon className="h-5 w-5" /> : <FiSun className="h-5 w-5" />}
        </button>

        {/* Notifications Indicator */}
        <div className="relative">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
            title="Notifications"
          >
            <FiBell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary-600 ring-2 ring-white dark:ring-darkbg-100"></span>
          </button>
        </div>

        {/* Quick User Link */}
        <Link to="/profile" className="flex items-center gap-2 rounded-xl p-1 hover:bg-slate-50 dark:hover:bg-slate-800">
          {user?.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt="Avatar"
              className="h-8 w-8 rounded-lg object-cover ring-2 ring-primary-100/50 dark:ring-primary-900/30"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary-500 to-indigo-500 font-sans text-xs font-bold text-white shadow-sm">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'ST'}
            </div>
          )}
          <span className="hidden text-sm font-semibold text-slate-700 dark:text-slate-300 sm:inline pr-1">
            {user?.name ? user.name.split(' ')[0] : 'Student'}
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
