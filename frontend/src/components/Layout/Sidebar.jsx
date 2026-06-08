import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  FiGrid,
  FiFolder,
  FiUpload,
  FiAward,
  FiCreditCard,
  FiUser,
  FiSettings,
  FiLogOut,
  FiPrinter,
  FiShield
} from 'react-icons/fi';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
    { name: 'My Documents', path: '/documents', icon: FiFolder },
    { name: 'Upload Document', path: '/upload', icon: FiUpload },
    { name: 'Scholarship Manager', path: '/scholarships', icon: FiAward },
    { name: 'Fee Receipts', path: '/receipts', icon: FiCreditCard },
    { name: 'Print Center', path: '/print-center', icon: FiPrinter },
    { name: 'Profile', path: '/profile', icon: FiUser },
    { name: 'Settings', path: '/settings', icon: FiSettings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (e) {
      console.error('Logout error', e);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed bottom-0 top-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-slate-100 transition-transform duration-300 dark:bg-darkbg-100 dark:border-slate-800 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 text-white shadow-md shadow-primary-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM22.5 10.5V7.5a3 3 0 00-3-3h-15a3 3 0 00-3 3v3h21z" />
              </svg>
            </div>
            <span className="font-sans text-xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-indigo-400">
              EduVault
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 lg:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6 custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100'
                  }`
                }
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {item.name}
              </NavLink>
            );
          })}

          {/* Admin Dashboard Entry (If Admin Role) */}
          {user && user.role === 'admin' && (
            <NavLink
              to="/admin"
              onClick={() => {
                if (window.innerWidth < 1024) toggleSidebar();
              }}
              className={({ isActive }) =>
                `flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold border border-transparent transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400'
                    : 'text-slate-600 border-dashed hover:border-emerald-100 hover:bg-emerald-50/30 hover:text-emerald-600 dark:text-slate-400 dark:hover:border-emerald-900/30 dark:hover:bg-emerald-950/10'
                }`
              }
            >
              <FiShield className="h-5 w-5 flex-shrink-0" />
              Admin Panel
            </NavLink>
          )}
        </nav>

        {/* User Card & Logout */}
        <div className="border-t border-slate-100 p-4 dark:border-slate-800">
          <div className="flex items-center gap-3 rounded-xl p-2.5">
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt="Profile avatar"
                className="h-10 w-10 rounded-xl object-cover ring-2 ring-primary-100 dark:ring-primary-900/30"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-500 to-indigo-500 font-sans text-sm font-bold text-white shadow-sm">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'ST'}
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              <h4 className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                {user?.name || 'Syncing...'}
              </h4>
              <p className="truncate text-xs font-medium text-slate-400 dark:text-slate-500">
                {user?.role === 'admin' ? 'System Administrator' : user?.branch || 'Student'}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-sm font-bold text-rose-600 transition-all hover:bg-rose-50 dark:bg-slate-800/40 dark:text-rose-400 dark:hover:bg-rose-950/20"
          >
            <FiLogOut className="h-4.5 w-4.5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
