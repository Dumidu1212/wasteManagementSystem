// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import UserProfile from './pages/UserProfile';
import AdminProfile from './pages/AdminProfile';
import Payment from './pages/Payment';
import Loyalty from './pages/Loyalty';
import PayPalButton from './pages/PayPalButtons';
import ScheduleCollection from './pages/ScheduleCollection';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import PersonnelDashboard from './components/Dashboard/PersonnelDashboard';
import UserDashboard from './components/Dashboard/UserDashboard';
import AdminPaymentManagement from './pages/AdminPaymentManagement';
import AdminRecyclingCredits from './pages/AdminRecyclingCredits';
import AdminScheduleManagement from './pages/AdminScheduleManagement';
import AdminUserManagement from './pages/AdminUserManagement';
import Reports from './pages/Reports';
import QRCodeScanner from './pages/QRCodeScanner';
import RegisterPersonnel from './pages/RegisterPersonnel';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import AdminLayout from './components/Layout/AdminLayout';
import { Box } from '@mui/material';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Box display="flex" flexDirection="column" minHeight="100vh">
          <Navbar />
          <Box component="main" flexGrow={1}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* User Profile Route */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute roles={['user']}>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes Accessible by Multiple Roles */}
              <Route
                path="/schedule-collection"
                element={
                  <ProtectedRoute roles={['user', 'admin']}>
                    <ScheduleCollection />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment"
                element={
                  <ProtectedRoute roles={['user', 'admin']}>
                    <Payment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pay"
                element={
                  <ProtectedRoute roles={['user', 'admin']}>
                    <PayPalButton />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/loyalty"
                element={
                  <ProtectedRoute roles={['user', 'admin']}>
                    <Loyalty />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <Reports />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="payments" element={<AdminPaymentManagement />} />
                <Route path="recycling-credits" element={<AdminRecyclingCredits />} />
                <Route path="schedules" element={<AdminScheduleManagement />} />
                <Route path="users" element={<AdminUserManagement />} />
                <Route path="personnel" element={<RegisterPersonnel />} />
                <Route path="personnel-dashboard" element={<PersonnelDashboard />} />
                <Route path="reports" element={<Reports />} />
                {/* Nested Admin Profile Route */}
                <Route path="profile" element={<AdminProfile />} />
              </Route>

              {/* Personnel Routes */}
              <Route
                path="/personnel-dashboard"
                element={
                  <ProtectedRoute roles={['personnel']}>
                    <PersonnelDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/scan-qr"
                element={
                  <ProtectedRoute roles={['personnel']}>
                    <QRCodeScanner />
                  </ProtectedRoute>
                }
              />

              {/* User Routes */}
              <Route
                path="/user-dashboard"
                element={
                  <ProtectedRoute roles={['user']}>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </AuthProvider>
  );
};

export default App;
