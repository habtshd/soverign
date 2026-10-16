import React from 'react';
import { User, Shield, Compass, Calendar, MapPin } from 'lucide-react';
import { FOUNDER_STORY } from './landing.data.js';

export const LandingFounder: React.FC = () => {
  return (
    <section id="founder" className="landing-section">
      <div className="landing-section-header">
        <span className="landing-section-badge">Genesis & Stewardship</span>
        <h2 className="landing-section-title">The Journey Behind Sovereign</h2>
        <p className="landing-section-subtitle">
          How personal tribulation, deep realization, and an uncompromising brotherhood standard sparked a movement across borders.
        </p>
      </div>

      <div className="founder-story-container">
        {/* Founder Portrait & Meta Card */}
        <aside className="founder-portrait-card">
          <div className="founder-silhouette-box">
            <User size={64} strokeWidth={1.5} />
          </div>

          <h3 className="founder-meta-name">{FOUNDER_STORY.name}</h3>
          <div className="founder-meta-role">{FOUNDER_STORY.title}</div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            fontSize: '0.74rem',
            color: 'var(--landing-text-subtle)',
            marginBottom: '16px'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={13} className="text-gold" />
              [FOUNDING LOCATION]
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={13} className="text-gold" />
              [FOUNDING YEAR]
            </span>
          </div>

          <p className="founder-meta-summary">
            {FOUNDER_STORY.summary}
          </p>

          <div style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid var(--landing-border)',
            fontSize: '0.72rem',
            color: 'var(--landing-gold)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 700
          }}>
            <Shield size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
            Brotherhood Standard Guardian
          </div>
        </aside>

        {/* Story Milestones Timeline */}
        <div className="founder-timeline-stream">
          {FOUNDER_STORY.milestones.map((m) => (
            <div key={m.stage} className="founder-timeline-node">
              <div className="founder-node-dot" />
              <div className="founder-node-stage">{m.stage}</div>
              <h4 className="founder-node-title">{m.title}</h4>
              <div className="founder-node-sub">{m.subtitle}</div>
              <p className="founder-node-narrative">{m.narrative}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
