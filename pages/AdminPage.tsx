
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

export const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'active' })
        .eq('id', id);

      if (error) throw error;
      // Optimistic update
      setUsers(users.map(u => u.id === id ? { ...u, status: 'active' } : u));
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="pt-24 min-h-screen flex">
      {/* Sidebar Placeholder */}
      <aside className="w-72 border-r border-white/5 hidden xl:block p-8">
        <nav className="space-y-8">
          <div>
            <h5 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">Core</h5>
            <div className="space-y-2">
              <div className="px-4 py-2 bg-white/5 rounded-lg text-emerald-400 font-bold text-sm">Users</div>
              <div className="px-4 py-2 hover:bg-white/5 rounded-lg text-white/40 text-sm cursor-pointer">Security</div>
            </div>
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-8 md:p-12 overflow-x-auto">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Admin Center</h1>
            <p className="text-white/40">Manage global system access and account states.</p>
          </div>
          <button onClick={fetchUsers} className="text-sm font-bold text-emerald-400 hover:text-emerald-300">
            Refresh Data
          </button>
        </header>

        <div className="glass rounded-3xl border border-white/5 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                <th className="px-8 py-6">Company Name</th>
                <th className="px-8 py-6">Role</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Joined</th>
                <th className="px-8 py-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                 <tr><td colSpan={5} className="px-8 py-6 text-center text-white/30">Loading users...</td></tr>
              ) : users.length === 0 ? (
                 <tr><td colSpan={5} className="px-8 py-6 text-center text-white/30">No users found.</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="font-bold">{user.company_name}</div>
                      <div className="text-[10px] text-white/30">ID: {user.id.slice(0, 8)}...</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-xs font-medium px-2 py-1 rounded bg-white/5 border border-white/5 ${user.is_admin ? 'text-emerald-400 border-emerald-500/30' : ''}`}>
                        {user.is_admin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-400' : user.status === 'pending' ? 'bg-amber-400' : 'bg-red-400'}`}></div>
                        <span className="text-sm capitalize">{user.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-white/40">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6">
                      {user.status === 'pending' && (
                        <button 
                          onClick={() => approveUser(user.id)}
                          className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold transition-all"
                        >
                          APPROVE
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
