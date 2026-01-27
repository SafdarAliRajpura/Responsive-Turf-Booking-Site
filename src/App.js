// src/App.js
import React from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Onboarding from './features/onboarding/Onboarding';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Home from './pages/Home';

function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Onboarding onComplete={() => navigate('/login')} />} />
      <Route path="/login" element={<Login onLogin={() => navigate('/home')} onRegisterClick={() => navigate('/register')} />} />
      <Route path="/register" element={<Register onRegister={() => navigate('/home')} onLoginClick={() => navigate('/login')} />} />
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


export default App;