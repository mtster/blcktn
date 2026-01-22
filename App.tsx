
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { MasterAdminCabinet } from './pages/MasterAdminCabinet';
import { AdminUserView } from './pages/AdminUserView';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { WaitingForApproval } from './pages/WaitingForApproval';
import { Navbar } from './components/Navbar';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MobileDebugger } from './components/MobileDebugger';

// --- LAYOUTS & PROTECTION ---

// Client Node Protection (Standard Users)
const ClientLayout = () => {
  const { user, profile, loading, authError } = useAuth();

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center font-black tracking-widest text-white/10">AUTHENTICATING_...</div>;
  
  if (authError) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold mb-2 text-white">Database Sync Error</h2>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-emerald-400 transition-colors"
        >
          Refresh Connection
        </button>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // AUTO-REDIRECT: If admin tries to access client dashboard, send to admin panel
  if (profile?.is_admin) return <Navigate to="/prio56" replace />;

  if (profile?.status === 'pending') return <Navigate to="/waiting-approval" replace />;
  if (profile?.status === 'suspended') return (
    <div className="min-h-screen pt-40 text-center flex flex-col items-center justify-center p-6">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20">
        <span className="text-4xl">🚫</span>
      </div>
      <h1 className="text-4xl font-black text-red-500 tracking-tighter mb-4">ACCESS_REVOKED</h1>
      <p className="text-white/40 max-w-md">Your corporate credentials have been suspended by system administration.</p>
    </div>
  );

  return <Outlet />;
};

// Master Admin Layer Protection
const MasterAdminLayout = () => {
  const { profile, loading, user, signOut, authError } = useAuth();
  const [isTimeout, setIsTimeout] = useState(false);
  
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (loading || (user && profile?.is_admin === undefined && !authError)) {
      timer = setTimeout(() => {
        setIsTimeout(true);
      }, 5000); 
    }
    return () => clearTimeout(timer);
  }, [loading, profile, user, authError]);

  if (authError) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold mb-2 text-white">Database Sync Error</h2>
        <div className="flex gap-4 mt-4">
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-emerald-400 transition-colors"
          >
            Refresh
          </button>
           <button 
            onClick={() => { signOut(); window.location.href = '/login'; }}
            className="px-6 py-2 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (isTimeout) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-xl font-bold mb-2">Connection Timeout</h2>
        <button 
          onClick={() => { signOut(); window.location.href = '/login'; }}
          className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-emerald-400 transition-colors mt-4"
        >
          Logout & Retry
        </button>
      </div>
    );
  }

  if (loading || (user && profile?.is_admin === undefined)) {
     return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
           <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
           <div className="text-[10px] font-bold text-white/20 tracking-widest animate-pulse">VERIFYING_PRIVILEGES...</div>
        </div>
     );
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (profile?.is_admin === false) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
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
          <MobileDebugger />
          <Navbar />
          <main>
            <Routes>
              {/* Public Surface */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/waiting-approval" element={<WaitingForApproval />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              
              {/* Client Space */}
              <Route element={<ClientLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>

              {/* Master Control Space (Obfuscated) */}
              <Route element={<MasterAdminLayout />}>
                <Route path="/prio56" element={<MasterAdminCabinet />} />
                <Route path="/prio56/user/:userId" element={<AdminUserView />} />
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
