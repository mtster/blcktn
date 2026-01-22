
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { AdminPage } from './pages/AdminPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { WaitingForApproval } from './pages/WaitingForApproval';
import { Navbar } from './components/Navbar';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected Route Component
const ProtectedRoute = () => {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white/30">Authenticating...</div>;
  
  if (!user) return <Navigate to="/login" />;
  
  if (profile?.status === 'pending') return <Navigate to="/waiting-approval" />;
  if (profile?.status === 'suspended') return <div className="min-h-screen pt-40 text-center text-red-500">Account Suspended</div>;

  return <Outlet />;
};

// Admin Route Component
const AdminRoute = () => {
  const { profile, loading } = useAuth();
  
  if (loading) return null;
  if (!profile?.is_admin) return <Navigate to="/dashboard" />;

  return <Outlet />;
};

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/waiting-approval" element={<WaitingForApproval />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#050505]" />;
  }

  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
