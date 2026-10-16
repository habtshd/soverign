import React from 'react';
import { THE_SCROLL_JOURNEY } from './landing.data.js';

export const LandingJourneyScroll: React.FC = () => {
  return (
    <section className="landing-section">
      <div className="landing-section-header">
        <span className="landing-section-badge">The Sovereign Progression</span>
        <h2 className="landing-section-title">The Lifelong Journey</h2>
        <p className="landing-section-subtitle">
          How a man awakens from passive complacency and ascends to generational leadership within the brotherhood.
        </p>
      </div>

      <div className="scroll-journey-rail">
        {THE_SCROLL_JOURNEY.map((item, idx) => (
          <div key={item.step} className="journey-step-bar">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{
                fontFamily: 'var(--landing-font-mono)',
                fontSize: '0.74rem',
                color: 'var(--landing-text-subtle)',
                fontWeight: 700
              }}>
                0{idx + 1}
              </span>
              <span className="journey-step-tag">{item.step}</span>
            </div>
            <p className="journey-step-text">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
