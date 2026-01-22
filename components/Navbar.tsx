
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, loading } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-emerald-500 rounded-sm rotate-45 group-hover:rotate-90 transition-transform duration-500"></div>
          <span className="text-xl font-bold tracking-tighter uppercase">Blackton</span>
        </Link>

        {!loading && user && (
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <Link to="/" className={`hover:text-white transition-colors ${isActive('/') ? 'text-white' : ''}`}>Platform</Link>
            {profile?.status === 'active' && (
              <Link to="/dashboard" className={`hover:text-white transition-colors ${isActive('/dashboard') ? 'text-white' : ''}`}>Dashboard</Link>
            )}
            
            {/* THE HIDDEN DOOR */}
            {profile?.is_admin && (
              <Link 
                to="/prio56" 
                className={`flex items-center gap-2 px-3 py-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-black text-[10px] tracking-widest hover:bg-red-500/20 transition-all ${isActive('/prio56') ? 'ring-1 ring-red-500/50' : ''}`}
              >
                <span>🛠️</span> MASTER CONTROL
              </Link>
            )}
          </div>
        )}

        <div className="flex items-center gap-4">
          {!loading && user ? (
            <>
              <div className="flex flex-col items-end mr-2">
                {profile?.is_admin ? (
                  <>
                    <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">BLACKTON SYSTEM ADMIN</span>
                    <span className="text-[8px] text-white/20 font-mono">ROOT_LEVEL_ACCESS</span>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">{profile?.company_name}</span>
                    <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1 rounded font-bold uppercase">Authorized Client</span>
                  </>
                )}
              </div>
              <button 
                onClick={() => { signOut(); navigate('/'); }}
                className="text-sm font-medium hover:text-white transition-colors text-white/60 bg-white/5 px-4 py-2 rounded-lg border border-white/10"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-white transition-colors text-white/60">Login</Link>
              <Link to="/login" className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-emerald-400 transition-all duration-300">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
