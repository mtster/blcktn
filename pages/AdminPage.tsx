
import React from 'react';
import { motion } from 'framer-motion';

export const AdminPage: React.FC = () => {
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
          <div>
            <h5 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">Operations</h5>
            <div className="space-y-2">
              <div className="px-4 py-2 hover:bg-white/5 rounded-lg text-white/40 text-sm cursor-pointer">Invoicing</div>
              <div className="px-4 py-2 hover:bg-white/5 rounded-lg text-white/40 text-sm cursor-pointer">Model Tuning</div>
            </div>
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-8 md:p-12 overflow-x-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Admin Center</h1>
          <p className="text-white/40">Manage global system access and account states.</p>
        </header>

        <div className="glass rounded-3xl border border-white/5 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                <th className="px-8 py-6">Account Name</th>
                <th className="px-8 py-6">Access Level</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Last Activity</th>
                <th className="px-8 py-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: "Tesla Motors, Inc.", type: "Enterprise", status: "Active", date: "Now" },
                { name: "SpaceX Corp.", type: "Global Tier", status: "Active", date: "2m ago" },
                { name: "Nvidia Data Center", type: "Enterprise", status: "Pending", date: "1h ago" },
                { name: "Apple Global HQ", type: "Custom Tier", status: "Suspended", date: "Oct 24" },
              ].map((user, idx) => (
                <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-bold">{user.name}</div>
                    <div className="text-[10px] text-white/30">ID: BK-7294-X{idx}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-medium px-2 py-1 rounded bg-white/5 border border-white/5">{user.type}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-400' : user.status === 'Pending' ? 'bg-amber-400' : 'bg-red-400'}`}></div>
                      <span className="text-sm">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-white/40">{user.date}</td>
                  <td className="px-8 py-6">
                    <button className="text-xs font-bold text-white/20 hover:text-white transition-colors">MANAGE</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
