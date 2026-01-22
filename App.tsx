import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { MasterAdminCabinet } from './pages/MasterAdminCabinet';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { WaitingForApproval } from './pages/WaitingForApproval';
import { Navbar } from './components/Navbar';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// --- LAYOUTS & PROTECTION ---

// Client Node Protection (Standard Users)
const ClientLayout = () => {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center font-black tracking-widest text-white/10">AUTHENTICATING_...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (profile?.status === 'pending') return <Navigate to="/waiting-approval" replace />;
  if (profile?.status === 'suspended') return (
    <div className="min-h-screen pt-40 text-center flex flex-col items-center justify-center p-6">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20">
        <span className="text-4xl">🚫</span>
      </div>
      <h1 className="text-4xl font-black text-red-500 tracking-tighter mb-4">ACCESS_REVOKED</h1>
      <p className="text-white/40 max-w-md">Your corporate credentials have been suspended by system administration. Please contact Blackton HQ for audit resolution.</p>
    </div>
  );

  return <Outlet />;
};

// Master Admin Layer Protection
const MasterAdminLayout = () => {
  const { profile, loading, user } = useAuth();
  
  console.log('Admin Access Check:', { is_admin: profile?.is_admin, path: window.location.pathname });

  // Primary loading state
  if (loading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center font-black tracking-widest text-white/10">VERIFYING_PRIVILEGES_...</div>;
  }

  // After loading, if the user is confirmed to be an admin, allow access.
  if (user && profile?.is_admin) {
    return <Outlet />;
  }

  // In all other cases (not logged in, not admin, profile still loading), redirect.
  return <Navigate to="/" replace />;
};

const App: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30">
          <Navbar />
          <main>
            <Routes>
              {/* Master Control Space (Obfuscated & Prioritized) */}
              <Route element={<MasterAdminLayout />}>
                <Route path="/prio56" element={<MasterAdminCabinet />} />
              </Route>

              {/* Public Surface */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/waiting-approval" element={<WaitingForApproval />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              
              {/* Client Space */}
              <Route element={<ClientLayout />}>
                <Route path="/dashboard/*" element={<Dashboard />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;