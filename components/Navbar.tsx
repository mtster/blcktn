
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-emerald-500 rounded-sm rotate-45 group-hover:rotate-90 transition-transform duration-500"></div>
          <span className="text-xl font-bold tracking-tighter uppercase">Blackton</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
          <Link to="/" className={`hover:text-white transition-colors ${isActive('/') ? 'text-white' : ''}`}>Platform</Link>
          <Link to="/dashboard" className={`hover:text-white transition-colors ${isActive('/dashboard') ? 'text-white' : ''}`}>Dashboard</Link>
          <Link to="/admin" className={`hover:text-white transition-colors ${isActive('/admin') ? 'text-white' : ''}`}>Administration</Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-sm font-medium hover:text-white transition-colors text-white/60">Login</button>
          <button className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-emerald-400 transition-all duration-300">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};
