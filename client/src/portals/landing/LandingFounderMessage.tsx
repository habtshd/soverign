import React from 'react';
import { FOUNDER_STORY } from './landing.data.js';

export const LandingFounderMessage: React.FC = () => {
  return (
    <section className="landing-section">
      <div className="founder-message-card">
        <h2 className="founder-message-title">
          {FOUNDER_STORY.message.heading}
        </h2>

        <div className="founder-message-paragraphs">
          {FOUNDER_STORY.message.body.map((para, idx) => (
            <p key={idx} style={{ margin: 0 }}>
              {para}
            </p>
          ))}
        </div>

        <div className="founder-signature-block">
          <div className="founder-signature-text">
            {FOUNDER_STORY.name}
          </div>
          <div className="founder-signature-title">
            {FOUNDER_STORY.title} • {FOUNDER_STORY.message.signatureDate}
          </div>
        </div>
      </div>
    </section>
  );
};
