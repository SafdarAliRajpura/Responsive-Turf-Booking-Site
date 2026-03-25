// src/App.js
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Onboarding from './features/onboarding/Onboarding';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import PartnerLogin from './features/partner/auth/PartnerLogin';
import PartnerRegister from './features/partner/auth/PartnerRegister';
import PartnerDashboard from './features/partner/pages/Dashboard';
import PartnerTurfs from './features/partner/pages/Turfs';
import PartnerAddTurf from './features/partner/pages/AddTurf';
import PartnerBookings from './features/partner/pages/Bookings';
import PartnerAnalytics from './features/partner/pages/Analytics';
import PartnerSettings from './features/partner/pages/Settings';
import PartnerLayout from './features/partner/layouts/PartnerLayout';
import Home from './pages/Home';

import Venue from './pages/Venue';
import Tournament from './pages/Tournament';
import TournamentRegistration from './pages/TournamentRegistration';
import MyBookings from './pages/MyBookings';
import Contact from './pages/Contact';
import HelpCenter from './pages/HelpCenter';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Booking from './pages/Booking';
import Community from './pages/Community';
import Profile from './pages/Profile';
import AdminLayout from './features/admin/layouts/AdminLayout';
import AdminDashboard from './features/admin/pages/Dashboard';
import AdminUsers from './features/admin/pages/Users';
import AdminVenues from './features/admin/pages/Venues';
import AdminTournaments from './features/admin/pages/Tournaments';
import AdminBookings from './features/admin/pages/Bookings';

// Role Guard for Restricted User Interface Access
const PublicUserGuard = ({ children }) => {
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  useEffect(() => {
    if (user) {
      if (user.role.toLowerCase() === 'admin') {
        navigate('/admin');
      } else if (user.role.toLowerCase() === 'partner') {
        navigate('/partner/dashboard');
      }
    }
  }, [user, navigate]);

  return children;
};

function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Onboarding onComplete={() => navigate('/login')} />} />
      <Route path="/login" element={<Login onLogin={(user) => {
        if (user && user.role && user.role.toLowerCase() === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      }} onRegisterClick={() => navigate('/register')} />} />
      <Route path="/register" element={<Register onRegister={() => navigate('/home')} onLoginClick={() => navigate('/login')} />} />

      {/* Partner Routes */}
      <Route path="/partner/login" element={<PartnerLogin />} />
      <Route path="/partner/register" element={<PartnerRegister />} />
      <Route path="/partner" element={<PartnerLayout />}>
        <Route path="dashboard" element={<PartnerDashboard />} />
        <Route path="turfs" element={<PartnerTurfs />} />
        <Route path="turfs/add" element={<PartnerAddTurf />} />
        <Route path="bookings" element={<PartnerBookings />} />
        <Route path="analytics" element={<PartnerAnalytics />} />
        <Route path="settings" element={<PartnerSettings />} />
      </Route>

      {/* Protected User UI Routes - Blocked for Admins/Partners */}
      <Route path="/home" element={<PublicUserGuard><Home /></PublicUserGuard>} />
      <Route path="/venues" element={<PublicUserGuard><Venue /></PublicUserGuard>} />
      <Route path="/tournaments" element={<PublicUserGuard><Tournament /></PublicUserGuard>} />
      <Route path="/tournaments/:id/register" element={<PublicUserGuard><TournamentRegistration /></PublicUserGuard>} />
      <Route path="/bookings" element={<PublicUserGuard><MyBookings /></PublicUserGuard>} />
      <Route path="/contact" element={<PublicUserGuard><Contact /></PublicUserGuard>} />
      <Route path="/help-center" element={<PublicUserGuard><HelpCenter /></PublicUserGuard>} />
      <Route path="/terms" element={<PublicUserGuard><TermsOfService /></PublicUserGuard>} />
      <Route path="/privacy" element={<PublicUserGuard><PrivacyPolicy /></PublicUserGuard>} />
      <Route path="/community" element={<PublicUserGuard><Community /></PublicUserGuard>} />
      <Route path="/book/:id" element={<PublicUserGuard><Booking /></PublicUserGuard>} />
      <Route path="/profile" element={<PublicUserGuard><Profile /></PublicUserGuard>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="venues" element={<AdminVenues />} />
        <Route path="tournaments" element={<AdminTournaments />} />
        <Route path="bookings" element={<AdminBookings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;