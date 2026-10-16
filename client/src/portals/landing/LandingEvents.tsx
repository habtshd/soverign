import React from 'react';
import { MapPin, Calendar, Users, ArrowUpRight } from 'lucide-react';
import { EVENTS_EXPERIENCES } from './landing.data.js';

export const LandingEvents: React.FC = () => {
  return (
    <section id="events" className="landing-section">
      <div className="landing-section-header">
        <span className="landing-section-badge">Crucibles & Assemblies</span>
        <h2 className="landing-section-title">Events & Experiences</h2>
        <p className="landing-section-subtitle">
          Real-world physical crucibles and high-level digital assemblies where men meet, sweat, strategize, and bond.
        </p>
      </div>

      {/* Infinite Seamless Looping Marquee */}
      <div className="events-marquee-wrapper">
        <div className="events-marquee-track">
          {[...EVENTS_EXPERIENCES, ...EVENTS_EXPERIENCES].map((evt, idx) => (
            <div key={`${evt.id}-${idx}`} className="event-timeline-card">
              <div className="event-card-cat">{evt.category}</div>
              <h3 className="event-card-title">{evt.title}</h3>

              <div className="event-card-meta">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={13} className="text-gold" />
                  {evt.seasonOrFrequency}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={13} className="text-gold" />
                  {evt.location}
                </span>
              </div>

              <p className="event-card-desc">{evt.description}</p>

              <div style={{
                marginTop: '18px',
                paddingTop: '14px',
                borderTop: '1px solid var(--landing-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}>
                <span style={{ color: evt.status === 'ESTABLISHED' ? '#22c55e' : '#eab308' }}>
                  ● {evt.status === 'ESTABLISHED' ? 'Active Chapter Calendar' : 'Expanding Territory'}
                </span>
                <span style={{ color: 'var(--landing-text-subtle)' }}>
                  {evt.format}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
