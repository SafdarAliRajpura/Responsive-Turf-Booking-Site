// src/App.js
import React from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Onboarding from './features/onboarding/Onboarding';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Home from './pages/Home';

import Venue from './pages/Venue';
import Tournament from './pages/Tournament';
import Booking from './pages/Booking';
import Community from './pages/Community';
import AdminLayout from './features/admin/layouts/AdminLayout';
import AdminDashboard from './features/admin/pages/Dashboard';
import AdminUsers from './features/admin/pages/Users';
import AdminVenues from './features/admin/pages/Venues';
import AdminTournaments from './features/admin/pages/Tournaments';
import AdminBookings from './features/admin/pages/Bookings';

function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Onboarding onComplete={() => navigate('/login')} />} />
      <Route path="/login" element={<Login onLogin={() => navigate('/home')} onRegisterClick={() => navigate('/register')} />} />
      <Route path="/register" element={<Register onRegister={() => navigate('/home')} onLoginClick={() => navigate('/login')} />} />
      <Route path="/home" element={<Home />} />
      <Route path="/venues" element={<Venue />} />
      <Route path="/tournaments" element={<Tournament />} />
      <Route path="/community" element={<Community />} />
      <Route path="/book/:id" element={<Booking />} />

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