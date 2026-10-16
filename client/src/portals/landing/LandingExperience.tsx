import React from 'react';
import { INSIDE_EXPERIENCE } from './landing.data.js';
import { Check } from 'lucide-react';

export const LandingExperience: React.FC = () => {
  return (
    <section id="experience" className="landing-section">
      <div className="landing-section-header">
        <span className="landing-section-badge">The Sovereign Arc</span>
        <h2 className="landing-section-title">Inside Sovereign</h2>
        <p className="landing-section-subtitle">
          From the day you take the covenant to the legacy you build decades later—this is the exact path walked by every member of the order.
        </p>
      </div>

      <div className="experience-steps-grid">
        {INSIDE_EXPERIENCE.map((step) => (
          <div key={step.number} className="experience-step-card">
            <div className="experience-num-badge">{step.number}</div>
            <h3 className="experience-step-title">{step.title}</h3>
            <div className="experience-step-sub">{step.subtitle}</div>
            <p className="experience-step-desc">{step.description}</p>

            <ul className="experience-detail-list">
              {step.details.map((detail, idx) => (
                <li key={idx} className="experience-detail-item">
                  <Check size={13} className="text-gold" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};
