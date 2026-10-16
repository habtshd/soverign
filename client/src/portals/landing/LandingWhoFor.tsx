import React from 'react';
import { WHO_IS_SOVEREIGN_FOR } from './landing.data.js';
import { CheckCircle2 } from 'lucide-react';

export const LandingWhoFor: React.FC = () => {
  return (
    <section id="who-for" className="landing-section">
      <div className="landing-section-header">
        <span className="landing-section-badge">Eligibility & Alignment</span>
        <h2 className="landing-section-title">Who Is Sovereign For?</h2>
        <p className="landing-section-subtitle">
          We do not screen by arbitrary corporate credentials or vanity metrics. We screen for character, work ethic, readiness, and honest hunger for discipline.
        </p>
      </div>

      <div className="who-for-grid">
        {WHO_IS_SOVEREIGN_FOR.map((item) => (
          <div key={item.criterion} className="who-for-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} className="text-gold" style={{ flexShrink: 0 }} />
              <h3 className="who-for-title">{item.criterion}</h3>
            </div>
            <p className="who-for-desc">{item.elaboration}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
