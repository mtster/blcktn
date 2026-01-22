
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Profile, Audit } from '../types';

export const MasterAdminCabinet: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersResponse, auditsResponse] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('audits').select('*').order('created_at', { ascending: false })
      ]);

      if (usersResponse.error) throw usersResponse.error;
      if (auditsResponse.error) throw auditsResponse.error;
      
      const profiles = usersResponse.data || [];
      setUsers(profiles);
      setAudits(auditsResponse.data || []);

      setStats({
        total: profiles.length,
        pending: profiles.filter(u => u.status === 'pending').length,
        active: profiles.filter(u => u.status === 'active').length
      });
    } catch (error) {
      console.error('Master Control Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: 'active' | 'suspended') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchData(); // Refresh data
    } catch (error) {
      alert('Action failed: ' + (error as Error).message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-[#050505] pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/20 bg-red-500/5 text-red-400 text-[10px] font-black tracking-[0.2em] mb-4">
            MASTER CONTROL LAYER
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-2">BLACKTON MASTER CONTROL</h1>
          <p className="text-white/40 max-w-2xl">Global enterprise state management and compliance override center.</p>
        </header>

        {/* Admin Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Total Entities", value: stats.total, color: "text-white" },
            { label: "Pending Verification", value: stats.pending, color: "text-amber-400" },
            { label: "Active Nodes", value: stats.active, color: "text-emerald-400" },
          ].map((stat, idx) => (
            <div key={idx} className="p-8 rounded-3xl border border-white/5 glass">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{stat.label}</span>
              <div className={`mt-2 text-4xl font-black ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="glass rounded-3xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h3 className="font-bold text-lg">Entity Directory</h3>
            <button 
              onClick={fetchData}
              className="px-4 py-2 text-xs font-bold text-white/40 hover:text-white transition-colors"
            >
              FORCE REFRESH
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold text-white/30 uppercase tracking-widest bg-white/[0.01]">
                  <th className="px-8 py-6">Entity Signature</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6">Auth Profile</th>
                  <th className="px-8 py-6">Registered</th>
                  <th className="px-8 py-6 text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                   <tr><td colSpan={5} className="px-8 py-20 text-center text-white/20 animate-pulse font-bold tracking-widest">ESTABLISHING DATA LINK...</td></tr>
                ) : users.length === 0 ? (
                   <tr><td colSpan={5} className="px-8 py-20 text-center text-white/20">NO ENTITIES DETECTED</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">{u.company_name}</div>
                        <div className="text-[10px] font-mono text-white/20 uppercase mt-1">{u.id}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            u.status === 'active' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 
                            u.status === 'pending' ? 'bg-amber-400' : 'bg-red-400'
                          }`}></div>
                          <span className={`text-xs font-bold uppercase tracking-tighter ${
                            u.status === 'active' ? 'text-emerald-400' : 
                            u.status === 'pending' ? 'text-amber-400' : 'text-red-400'
                          }`}>{u.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-md border ${
                          u.is_admin ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-white/5 border-white/10 text-white/40'
                        }`}>
                          {u.is_admin ? 'ROOT_USER' : 'CLIENT_NODE'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm font-medium text-white/40">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6 text-right space-x-3">
                        {u.status === 'pending' && (
                          <button 
                            onClick={() => updateStatus(u.id, 'active')}
                            className="px-4 py-2 bg-emerald-500 text-black text-[10px] font-black rounded-lg hover:bg-emerald-400 transition-all uppercase"
                          >
                            Authorize
                          </button>
                        )}
                        {u.status === 'active' && !u.is_admin && (
                          <button 
                            onClick={() => updateStatus(u.id, 'suspended')}
                            className="px-4 py-2 border border-red-500/20 text-red-400 text-[10px] font-black rounded-lg hover:bg-red-500 hover:text-white transition-all uppercase"
                          >
                            Revoke
                          </button>
                        )}
                        {u.status === 'suspended' && (
                          <button 
                            onClick={() => updateStatus(u.id, 'active')}
                            className="px-4 py-2 border border-white/10 text-white/40 text-[10px] font-black rounded-lg hover:bg-white/10 hover:text-white transition-all uppercase"
                          >
                            Restore
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audits Table */}
        <div className="glass rounded-3xl border border-white/5 overflow-hidden mt-12">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h3 className="font-bold text-lg">Audits Ledger</h3>
            <span className="text-xs text-white/40">{audits.length} Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold text-white/30 uppercase tracking-widest bg-white/[0.01]">
                  <th className="px-8 py-6">Audit ID</th>
                  <th className="px-8 py-6">User ID</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                   <tr><td colSpan={4} className="px-8 py-20 text-center text-white/20 animate-pulse font-bold tracking-widest">LOADING AUDITS...</td></tr>
                ) : audits.length === 0 ? (
                   <tr><td colSpan={4} className="px-8 py-20 text-center text-white/20">NO AUDIT RECORDS FOUND</td></tr>
                ) : (
                  audits.map((audit) => (
                    <tr key={audit.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6 font-mono text-xs text-white/40">{audit.id}</td>
                      <td className="px-8 py-6 font-mono text-xs text-white/40">{audit.user_id}</td>
                      <td className="px-8 py-6">
                        <span className={`text-xs font-bold uppercase tracking-tighter ${
                          audit.status === 'completed' ? 'text-emerald-400' :
                          audit.status === 'processing' ? 'text-amber-400' : 'text-red-400'
                        }`}>{audit.status}</span>
                      </td>
                      <td className="px-8 py-6 text-sm font-medium text-white/40">
                        {new Date(audit.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
