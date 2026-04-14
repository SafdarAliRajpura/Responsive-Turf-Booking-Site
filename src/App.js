// src/App.js
import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import PremiumLoader from './components/ui/PremiumLoader';
import NotificationToast from './components/common/NotificationToast';

// Lazy Loaded Auth & Onboarding
const Onboarding = lazy(() => import('./features/onboarding/Onboarding'));
const Login = lazy(() => import('./features/auth/Login'));
const Register = lazy(() => import('./features/auth/Register'));

// Lazy Loaded Partner Modules
const PartnerLogin = lazy(() => import('./features/partner/auth/PartnerLogin'));
const PartnerRegister = lazy(() => import('./features/partner/auth/PartnerRegister'));
const PartnerOnboarding = lazy(() => import('./features/partner/pages/PartnerOnboarding'));
const PartnerDashboard = lazy(() => import('./features/partner/pages/Dashboard'));
const PartnerTurfs = lazy(() => import('./features/partner/pages/Turfs'));
const PartnerAddTurf = lazy(() => import('./features/partner/pages/AddTurf'));
const PartnerBookings = lazy(() => import('./features/partner/pages/Bookings'));
const PartnerAnalytics = lazy(() => import('./features/partner/pages/Analytics'));
const PartnerSettings = lazy(() => import('./features/partner/pages/Settings'));
const PartnerTournaments = lazy(() => import('./features/partner/pages/Tournaments'));
const PartnerScanner = lazy(() => import('./features/partner/pages/Scanner'));
const PartnerLayout = lazy(() => import('./features/partner/layouts/PartnerLayout'));

// Lazy Loaded Public Pages
const Home = lazy(() => import('./pages/Home'));
const Venue = lazy(() => import('./pages/Venue'));
const Tournament = lazy(() => import('./pages/Tournament'));
const TournamentRegistration = lazy(() => import('./pages/TournamentRegistration'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const Contact = lazy(() => import('./pages/Contact'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Booking = lazy(() => import('./pages/Booking'));
const Community = lazy(() => import('./pages/Community'));
const Profile = lazy(() => import('./pages/Profile'));

// Lazy Loaded Admin Modules
const AdminLayout = lazy(() => import('./features/admin/layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('./features/admin/pages/Dashboard'));
const AdminUsers = lazy(() => import('./features/admin/pages/Users'));
const AdminVenues = lazy(() => import('./features/admin/pages/Venues'));
const AdminTournaments = lazy(() => import('./features/admin/pages/Tournaments'));
const AdminBookings = lazy(() => import('./features/admin/pages/Bookings'));
const AdminInquiries = lazy(() => import('./features/admin/pages/Inquiries'));

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
        if (user.isOnboarded) {
          navigate('/partner/dashboard');
        } else {
          navigate('/partner/onboarding');
        }
      }
    }
  }, [user, navigate]);

  return children;
};

function App() {
  const navigate = useNavigate();

  return (
    <Suspense fallback={<PremiumLoader />}>
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
        <Route path="/partner/onboarding" element={<PartnerOnboarding />} />
        <Route path="/partner" element={<PartnerLayout />}>
          <Route path="dashboard" element={<PartnerDashboard />} />
          <Route path="turfs" element={<PartnerTurfs />} />
          <Route path="turfs/add" element={<PartnerAddTurf />} />
          <Route path="bookings" element={<PartnerBookings />} />
          <Route path="analytics" element={<PartnerAnalytics />} />
          <Route path="tournaments" element={<PartnerTournaments />} />
          <Route path="settings" element={<PartnerSettings />} />
          <Route path="scanner" element={<PartnerScanner />} />
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
          <Route path="inquiries" element={<AdminInquiries />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <NotificationToast />
    </Suspense>
  );
}

export default App;