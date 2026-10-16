import React from 'react';
import { WHAT_WE_ARE_BUILDING } from './landing.data.js';

export const LandingVisionPath: React.FC = () => {
  return (
    <section id="vision" className="landing-section">
      <div className="landing-section-header">
        <span className="landing-section-badge">The Generational Objective</span>
        <h2 className="landing-section-title">{WHAT_WE_ARE_BUILDING.title}</h2>
        <p className="landing-section-subtitle">
          {WHAT_WE_ARE_BUILDING.subtitle}
        </p>
      </div>

      <div className="vision-journey-wrapper">
        <div className="vision-central-line" />

        <div className="vision-items-stack">
          {WHAT_WE_ARE_BUILDING.tenets.map((tenet, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div 
                key={tenet.label} 
                className={`vision-step-row ${isEven ? 'row-left' : 'row-right'}`}
              >
                <div className="vision-card">
                  <span className="vision-card-cat">
                    {tenet.category}
                  </span>
                  <h3 className="vision-card-title">
                    {tenet.label}
                  </h3>
                  <p className="vision-card-desc">
                    {tenet.detail}
                  </p>
                </div>

                {/* Central Dot Marker */}
                <div className="vision-node-marker" title={`Dimension ${idx + 1}`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
