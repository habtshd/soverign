import React from 'react';
import { FUTURE_VISION_AREAS } from './landing.data.js';

export const LandingFutureVision: React.FC = () => {
  return (
    <section className="landing-section">
      <div className="landing-section-header">
        <span className="landing-section-badge">The Roadmap Ahead</span>
        <h2 className="landing-section-title">This Is Only The Beginning.</h2>
        <p className="landing-section-subtitle">
          We do not boast of finished horizons. Here is the unvarnished long-term vision we are steadily building stone-by-stone.
        </p>
      </div>

      <div className="vision-areas-grid">
        {FUTURE_VISION_AREAS.map((area) => (
          <div key={area.title} className="vision-area-card">
            <div className="vision-area-scope">{area.scope}</div>
            <h3 className="vision-area-title">{area.title}</h3>
            <p className="vision-area-manifesto">{area.manifesto}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
