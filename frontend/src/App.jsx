import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DashboardLayout from './components/Layout/DashboardLayout.jsx';

// Pages
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import MyDocuments from './pages/MyDocuments.jsx';
import UploadDocument from './pages/UploadDocument.jsx';
import ScholarshipManager from './pages/ScholarshipManager.jsx';
import FeeReceipts from './pages/FeeReceipts.jsx';
import PrintCenter from './pages/PrintCenter.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Student Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MyDocuments />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <UploadDocument />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/scholarships"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ScholarshipManager />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/receipts"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <FeeReceipts />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/print-center"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PrintCenter />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly={true}>
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
