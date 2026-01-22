
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Profile, Audit } from '../types';

export const AdminUserView: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit States
  const [editCompany, setEditCompany] = useState('');
  const [editStatus, setEditStatus] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchData(userId);
    }
  }, [userId]);

  const fetchData = async (id: string) => {
    setLoading(true);
    try {
      const [profileRes, auditsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', id).single(),
        supabase.from('audits').select('*').eq('user_id', id).order('created_at', { ascending: false })
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data as Profile);
        setEditCompany(profileRes.data.company_name);
        setEditStatus(profileRes.data.status);
      }
      
      if (auditsRes.data) {
        setAudits(auditsRes.data as Audit[]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userId) return;
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          company_name: editCompany,
          status: editStatus
        })
        .eq('id', userId);

      if (error) throw error;
      
      // Refresh local data
      fetchData(userId);
      alert("User profile updated successfully.");
    } catch (e) {
      console.error("Update failed:", e);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/40 text-xs tracking-widest animate-pulse">RETRIEVING NODE DATA...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h1 className="text-2xl font-bold">User Not Found</h1>
        <button onClick={() => navigate('/prio56')} className="text-emerald-400 mt-4 underline">Back to Admin</button>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-[#050505] pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <button 
          onClick={() => navigate('/prio56')}
          className="text-xs font-bold text-white/40 hover:text-white mb-8 flex items-center gap-2"
        >
          ← BACK TO PANEL
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Edit Column */}
          <div className="md:col-span-2 space-y-8">
            <div className="glass rounded-3xl border border-white/5 p-8">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold">Profile Management</h2>
                 <span className="text-[10px] font-mono text-white/20 uppercase">ID: {profile.id}</span>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase mb-2">Company Name</label>
                  <input 
                    type="text" 
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase mb-2">Account Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? 'Saving Changes...' : 'Save Configuration'}
                  </button>
                  <div className={`px-3 py-1.5 rounded text-xs font-bold uppercase ${
                    profile.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 
                    profile.status === 'suspended' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    Current: {profile.status}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl border border-white/5 overflow-hidden">
               <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                  <h3 className="font-bold">Audit History ({audits.length})</h3>
               </div>
               {audits.length === 0 ? (
                 <div className="p-8 text-center text-white/20 text-sm">No audits found for this entity.</div>
               ) : (
                 <div className="divide-y divide-white/5">
                   {audits.map(audit => (
                     <div key={audit.id} className="p-6 hover:bg-white/5 transition-colors flex items-center justify-between">
                        <div>
                          <p className="font-bold text-sm mb-1">{new Date(audit.created_at).toLocaleDateString()}</p>
                          <p className="text-xs text-white/40 font-mono">{audit.id}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                             audit.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/10 text-white/40'
                          }`}>
                            {audit.status}
                          </span>
                        </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          </div>

          {/* Side Panel Info */}
          <div className="space-y-6">
             <div className="glass rounded-3xl border border-white/5 p-6">
               <h3 className="text-sm font-bold text-white/60 uppercase mb-4">Metadata</h3>
               <div className="space-y-4">
                 <div>
                   <span className="block text-[10px] text-white/30 uppercase">Role</span>
                   <span className="font-mono text-sm">{profile.is_admin ? 'ADMIN' : 'USER'}</span>
                 </div>
                 <div>
                   <span className="block text-[10px] text-white/30 uppercase">Joined</span>
                   <span className="font-mono text-sm">{new Date(profile.created_at).toLocaleString()}</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
