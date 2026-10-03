import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { Navbar } from './components/common/Navbar.js';
import { Footer } from './components/common/Footer.js';
import { ProtectedRoute } from './components/common/ProtectedRoute.js';

// Pages
import { LandingPage } from './pages/LandingPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard.js';
import { StudentComplaintsPage } from './pages/student/StudentComplaintsPage.js';
import { StudentHistoryPage } from './pages/student/StudentHistoryPage.js';
import { StudentStatsPage } from './pages/student/StudentStatsPage.js';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard.js';
import { MenuManagementPage } from './pages/admin/MenuManagementPage.js';
import { ComplaintManagementPage } from './pages/admin/ComplaintManagementPage.js';
import { SentimentAnalyticsPage } from './pages/admin/SentimentAnalyticsPage.js';
import { ReportsPage } from './pages/admin/ReportsPage.js';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Student Protected Routes */}
              <Route
                path="/student"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/complaints"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentComplaintsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/history"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/stats"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentStatsPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/menu"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <MenuManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/complaints"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ComplaintManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/sentiment"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SentimentAnalyticsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
