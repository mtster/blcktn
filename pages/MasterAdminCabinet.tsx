
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const MasterAdminCabinet: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<boolean>(false);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0
  });

  const fetchUsers = async () => {
    setLoading(true);
    setDbError(false);
    
    try {
      // Fetch all profiles EXCEPT the Master Admin ID to avoid cluttering the list
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', '50529017-99f7-4797-9b27-3f363596dc2e')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("[MASTER] Fetch failed:", error.message);
        setDbError(true);
      } else {
        const profiles = data || [];
        setUsers(profiles);
        setStats({
          total: profiles.length,
          pending: profiles.filter(u => u.status === 'pending').length,
          active: profiles.filter(u => u.status === 'active').length
        });
      }
    } catch (error) {
      console.error('[MASTER] Unexpected error:', error);
      setDbError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-[#050505] pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Admin Cabinet</h1>
          </div>
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
              onClick={fetchUsers}
              className="px-4 py-2 text-xs font-bold text-white/40 hover:text-white transition-colors"
            >
              REFRESH
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
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                   <tr><td colSpan={4} className="px-8 py-20 text-center text-white/20 animate-pulse font-bold tracking-widest">LOADING DIRECTORY...</td></tr>
                ) : dbError ? (
                   <tr>
                     <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center">
                           <p className="text-red-400 font-bold mb-2">Data Link Interrupted</p>
                           <button onClick={fetchUsers} className="text-xs underline hover:text-white">Retry</button>
                        </div>
                     </td>
                   </tr>
                ) : users.length === 0 ? (
                   <tr><td colSpan={4} className="px-8 py-20 text-center text-white/20">NO ENTITIES DETECTED</td></tr>
                ) : (
                  users.map((u) => {
                    const isMe = u.id === currentUser?.id;
                    return (
                      <tr 
                        key={u.id} 
                        onClick={() => navigate(`/prio56/user/${u.id}`)}
                        className={`group transition-colors cursor-pointer ${isMe ? 'bg-emerald-500/5' : 'hover:bg-white/5'}`}
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                             <div className={`font-bold transition-colors ${isMe ? 'text-emerald-400' : 'text-white group-hover:text-emerald-400'}`}>
                                {u.company_name}
                             </div>
                             {isMe && <span className="text-[9px] bg-emerald-500 text-black px-1.5 py-0.5 rounded font-bold">YOU</span>}
                          </div>
                          <div className="text-[10px] font-mono text-white/20 uppercase mt-1">{u.id}</div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              u.status === 'active' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 
                              u.status === 'suspended' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                              'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            }`}></div>
                            <span className={`text-xs font-bold uppercase ${
                               u.status === 'active' ? 'text-emerald-400' : 
                               u.status === 'suspended' ? 'text-red-400' : 
                               'text-amber-400'
                            }`}>{u.status}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                            u.is_admin 
                            ? 'border-red-500/30 text-red-400 bg-red-500/10' 
                            : 'border-white/10 text-white/40 bg-white/5'
                          }`}>
                            {u.is_admin ? 'ROOT_ADMIN' : 'STANDARD_CLIENT'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-sm text-white/40">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
