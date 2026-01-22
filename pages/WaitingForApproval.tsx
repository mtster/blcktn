
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const WaitingForApproval: React.FC = () => {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  // If somehow active, go to dashboard
  if (profile?.status === 'active') {
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-6 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg"
      >
        <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-500/20">
          <span className="text-4xl">⏳</span>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Verification Pending</h1>
        <p className="text-xl text-white/50 mb-8">
          Your account for <span className="text-white font-bold">{profile?.company_name}</span> is currently under review by our administrators.
        </p>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left">
          <h3 className="text-sm font-bold text-white mb-2">What happens next?</h3>
          <p className="text-xs text-white/40 leading-relaxed">
            Our compliance team verifies all corporate entities within 24 hours. You will receive an email notification once your access to the Blackton Dashboard is enabled.
          </p>
        </div>

        <button 
          onClick={() => signOut()}
          className="px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 text-sm font-bold transition-colors"
        >
          Logout
        </button>
      </motion.div>
    </div>
  );
};
