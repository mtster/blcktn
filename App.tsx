
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
import { MobileDebugger } from './components/MobileDebugger';

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
  const { profile, loading, user, signOut } = useAuth();
  const [isTimeout, setIsTimeout] = useState(false);
  
  useEffect(() => {
    // LOGGING ENHANCEMENT
    console.log("DEBUG: Attempting to render path: " + window.location.pathname);
    
    if (!loading) {
      console.log(`DEBUG: Profile Loaded. Admin Status: ${profile?.is_admin}, UserID: ${user?.id}`);
      if (profile?.is_admin) {
        console.log("AUTH SUCCESS: Admin Session Active");
      }
    } else {
      console.log("DEBUG: Auth is loading...");
    }

    // Timeout Logic
    let timer: ReturnType<typeof setTimeout>;
    if (loading || (user && profile?.is_admin === undefined)) {
      timer = setTimeout(() => {
        setIsTimeout(true);
      }, 5000); // 5 seconds timeout
    }

    return () => clearTimeout(timer);
  }, [loading, profile, user]);

  if (isTimeout) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 border border-amber-500/20">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-xl font-bold mb-2">Connection Timeout</h2>
        <p className="text-white/40 text-sm mb-6 max-w-md">
          The security handshake with the database is taking longer than expected. 
        </p>
        <button 
          onClick={() => { signOut(); window.location.href = '/login'; }}
          className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-emerald-400 transition-colors"
        >
          Logout & Retry
        </button>
      </div>
    );
  }

  // If loading OR is_admin is undefined (data hasn't arrived yet), show loading.
  if (loading || (user && profile?.is_admin === undefined)) {
     return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
           <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
           <div className="text-[10px] font-bold text-white/20 tracking-widest animate-pulse">VERIFYING_PRIVILEGES...</div>
        </div>
     );
  }
  
  // If not logged in after loading finishes, silent fail to home
  if (!user) {
    console.log("DEBUG: Access Denied - No User found.");
    return <Navigate to="/" replace />;
  }

  // ONLY redirect if is_admin is explicitly FALSE.
  if (profile?.is_admin === false) {
    console.log("DEBUG: Access Denied - User is explicitly NOT an admin.");
    return <Navigate to="/" replace />;
  }

  // If we are here, is_admin is TRUE.
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
