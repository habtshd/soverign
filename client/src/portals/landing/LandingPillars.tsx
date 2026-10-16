import React from 'react';
import { Shield, Users, Compass, TrendingUp, Award, Crown } from 'lucide-react';
import { THE_PILLARS } from './landing.data.js';

export const LandingPillars: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield': return <Shield size={22} />;
      case 'Users': return <Users size={22} />;
      case 'Compass': return <Compass size={22} />;
      case 'TrendingUp': return <TrendingUp size={22} />;
      case 'Award': return <Award size={22} />;
      case 'Crown':
      default:
        return <Crown size={22} />;
    }
  };

  return (
    <section id="pillars" className="landing-section">
      <div className="landing-section-header">
        <span className="landing-section-badge">The Unshakable Foundation</span>
        <h2 className="landing-section-title">The Six Pillars</h2>
        <p className="landing-section-subtitle">
          These principles are not suggestions or slogans; they are the bedrock covenants that govern every Sovereign man.
        </p>
      </div>

      <div className="pillars-grid">
        {THE_PILLARS.map((p) => (
          <div key={p.id} className="pillar-card">
            <div className="pillar-top-row">
              <div className="pillar-icon-box">
                {getIcon(p.iconName)}
              </div>
              <span style={{ 
                fontFamily: varToString(), 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                color: 'var(--landing-text-subtle)', 
                letterSpacing: '0.1em' 
              }}>
                PILLAR 0{THE_PILLARS.indexOf(p) + 1}
              </span>
            </div>

            <h3 className="pillar-title">{p.title}</h3>
            <div className="pillar-tagline">{p.tagline}</div>
            <p className="pillar-description">{p.description}</p>

            {p.quote && (
              <blockquote className="pillar-quote">
                "{p.quote}"
              </blockquote>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

function varToString() {
  return 'var(--landing-font-mono)';
}
