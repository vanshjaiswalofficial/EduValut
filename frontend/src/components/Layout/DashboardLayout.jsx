import React, { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-darkbg-200">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden lg:pl-64">
        {/* Header Navigation */}
        <Topbar toggleSidebar={toggleSidebar} />

        {/* Scrollable Page Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
