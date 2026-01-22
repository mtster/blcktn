
import React from 'react';

export const TermsPage: React.FC = () => (
  <div className="pt-40 px-6 max-w-3xl mx-auto pb-32">
    <h1 className="text-4xl font-bold mb-12">Terms of Service</h1>
    <div className="prose prose-invert text-white/60 space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
        <p>By accessing Blackton, you agree to provide accurate corporate data and use our carbon auditing tools for lawful compliance purposes only.</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">2. Accuracy of AI Output</h2>
        <p>While Gemini AI is highly accurate, carbon auditing is an estimation science. Blackton is not liable for regulatory fines based on AI-derived estimations; users should verify final reports.</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">3. Subscription</h2>
        <p>Accounts are billed monthly based on the selected tier. Failure to pay will result in restricted access to historical audit logs.</p>
      </section>
    </div>
  </div>
);
