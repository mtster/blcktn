
import React from 'react';

export const PrivacyPage: React.FC = () => (
  <div className="pt-40 px-6 max-w-3xl mx-auto pb-32">
    <h1 className="text-4xl font-bold mb-12">Privacy Policy</h1>
    <div className="prose prose-invert text-white/60 space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">1. Data Collection</h2>
        <p>Blackton collects company utility data and administrative details solely for the purpose of generating carbon emission reports. We leverage Google Gemini AI to process documents; data sent to the AI is handled according to enterprise safety standards.</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">2. Document Storage</h2>
        <p>Utility bills are stored in encrypted Supabase storage buckets. Access is restricted to your authorized account members and system administrators.</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">3. AI Processing</h2>
        <p>Our integration with Gemini AI does not use your private utility data to train public models. All processing occurs in transient sessions.</p>
      </section>
    </div>
  </div>
);
