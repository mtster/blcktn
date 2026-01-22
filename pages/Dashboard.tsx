
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileUploadModal } from '../components/FileUploadModal';

export const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="pt-24 min-h-screen px-6 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Portfolio Overview</h1>
          <p className="text-white/40">Real-time carbon telemetry for Tesla Motors, Inc.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
        >
          New Audit Request
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Total CO2e", value: "4,210.5", unit: "metric tons", trend: "+2.1%" },
          { label: "Compliance Score", value: "98/100", unit: "Excellent", trend: "+0.5%" },
          { label: "Energy Spend", value: "$1.2M", unit: "Annualized", trend: "-4.2%" },
          { label: "Audits Pending", value: "3", unit: "Critical", trend: "0" },
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-2xl border border-white/5 glass"
          >
            <span className="text-xs font-bold text-white/30 uppercase tracking-widest">{stat.label}</span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold">{stat.value}</span>
              <span className="text-xs text-white/30">{stat.unit}</span>
            </div>
            <div className={`mt-2 text-xs font-bold ${stat.trend.startsWith('+') ? 'text-red-400' : 'text-emerald-400'}`}>
              {stat.trend} vs last month
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 rounded-3xl border border-white/5 glass min-h-[400px]">
          <h3 className="text-xl font-bold mb-8">Emission Trends</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[40, 65, 45, 90, 85, 55, 70, 60, 40, 80, 95, 75].map((h, i) => (
              <div 
                key={i} 
                className="w-full bg-emerald-500/20 hover:bg-emerald-500/40 transition-colors rounded-t-md"
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-white/20 font-bold uppercase tracking-widest">
            <span>Jan</span>
            <span>Jun</span>
            <span>Dec</span>
          </div>
        </div>

        <div className="p-8 rounded-3xl border border-white/5 glass">
          <h3 className="text-xl font-bold mb-8">Recent Activities</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                </div>
                <div>
                  <p className="text-sm font-bold">Audit Completed: Bill #829{i}</p>
                  <p className="text-xs text-white/30">2.4 tCO2e extracted • 2h ago</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-3 text-xs font-bold text-white/30 border border-white/5 hover:bg-white/5 rounded-xl transition-all">
            VIEW ALL LOGS
          </button>
        </div>
      </div>

      {isModalOpen && <FileUploadModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
