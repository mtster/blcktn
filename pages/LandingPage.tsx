
import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => (
  <section className="relative pt-40 pb-32 px-6 overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
    
    <div className="max-w-5xl mx-auto text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-bold mb-8"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        SEC COMPLIANT CARBON AUDITING
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.05]"
      >
        Decarbonize your <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/30">enterprise future.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12"
      >
        Automated Scope 1, 2, and 3 carbon auditing powered by Gemini 1.5 Flash. 
        Precise, compliant, and insanely fast.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-emerald-400 transition-all text-lg shadow-xl shadow-emerald-500/10">
          Begin Audit
        </button>
        <button className="px-8 py-4 border border-white/10 hover:bg-white/5 font-bold rounded-full transition-all text-lg backdrop-blur-md">
          View Demo
        </button>
      </motion.div>
    </div>
  </section>
);

const ComplianceShield = () => (
  <section className="py-24 px-6 border-y border-white/5 bg-white/[0.01]">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { title: "Global Compliance", desc: "Automated reporting for SEC, CSRD, and BRSR regulations." },
          { title: "AI-Driven Extraction", desc: "Process thousands of utility bills in seconds with 99.8% accuracy." },
          { title: "Audit Ready", desc: "Every transaction is logged on a secure immutable ledger." }
        ].map((item, idx) => (
          <div key={idx} className="p-8 rounded-2xl border border-white/5 glass">
            <h3 className="text-xl font-bold mb-4">{item.title}</h3>
            <p className="text-white/40 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const LandingPage: React.FC = () => {
  return (
    <div className="bg-[#050505]">
      <HeroSection />
      <ComplianceShield />
      
      {/* How it works */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Precision Workflow</h2>
            <p className="text-white/40">The most advanced data processing pipeline in the industry.</p>
          </div>
          
          <div className="space-y-12">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex gap-8 items-start group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center font-bold text-xl group-hover:border-emerald-500 transition-colors">
                  {step}
                </div>
                <div>
                  <h4 className="text-2xl font-bold mb-2">Ingest & Extract</h4>
                  <p className="text-white/50 leading-relaxed">
                    Upload your raw data in any format. Our AI identifies meters, vendors, and usage peaks automatically.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-32 px-6 bg-emerald-500/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl border border-white/5 glass">
              <span className="text-xs font-bold text-emerald-400">STARTER</span>
              <h3 className="text-3xl font-bold my-4">$2,500<span className="text-lg text-white/30">/mo</span></h3>
              <ul className="space-y-4 text-white/50 mb-8">
                <li>• Up to 100 bills/month</li>
                <li>• Scope 1 & 2 Reporting</li>
                <li>• Email Support</li>
              </ul>
              <button className="w-full py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors">Select Plan</button>
            </div>
            <div className="p-8 rounded-3xl border border-emerald-500/30 glass relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[10px] font-bold px-3 py-1 rounded-full">POPULAR</div>
              <span className="text-xs font-bold text-emerald-400">ENTERPRISE</span>
              <h3 className="text-3xl font-bold my-4">$8,900<span className="text-lg text-white/30">/mo</span></h3>
              <ul className="space-y-4 text-white/50 mb-8">
                <li>• Unlimited bill processing</li>
                <li>• Full ESG Suite</li>
                <li>• 24/7 Account Manager</li>
              </ul>
              <button className="w-full py-3 rounded-full bg-white text-black font-bold">Select Plan</button>
            </div>
            <div className="p-8 rounded-3xl border border-white/5 glass">
              <span className="text-xs font-bold text-emerald-400">CUSTOM</span>
              <h3 className="text-3xl font-bold my-4">Contact Us</h3>
              <p className="text-white/50 mb-8">For global conglomerates requiring custom on-prem deployment.</p>
              <button className="w-full py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors">Talk to Sales</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-white/20 text-sm">© 2024 Blackton Technologies Inc.</span>
          <div className="flex gap-8 text-sm text-white/40">
            <a href="#/privacy" className="hover:text-white">Privacy</a>
            <a href="#/terms" className="hover:text-white">Terms</a>
            <a href="mailto:hq@blackton.io" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
