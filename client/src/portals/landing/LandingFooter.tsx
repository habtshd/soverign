import React from 'react';
import { FOOTER_DATA, BRAND_CONFIG } from './landing.data.js';
import { Shield } from 'lucide-react';
import { LegalDocType } from './LandingLegalModal.js';

interface LandingFooterProps {
  onLegalClick?: (doc: LegalDocType) => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onLegalClick }) => {
  const legalMap: Record<string, LegalDocType> = {
    'Privacy Policy': 'privacy',
    'Brotherhood Terms': 'terms',
    'Membership Agreement': 'agreement',
    'Readiness Code': 'readiness'
  };

  return (
    <footer className="landing-footer">
      <div className="footer-top-grid">
        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <img src="/logo.png" alt="Sovereign Logo" className="logo-dark" style={{ width: '40px', height: '40px' }} />
            <img src="/logo-light.png" alt="Sovereign Logo" className="logo-light" style={{ width: '40px', height: '40px' }} />
            <h3 className="footer-brand-title" style={{ margin: 0 }}>Sovereign Men's Club</h3>
          </div>
          <p className="footer-brand-creed">
            "{BRAND_CONFIG.tagline}"
          </p>
          <div style={{ fontSize: '0.75rem', color: 'var(--landing-text-subtle)', marginTop: '12px' }}>
            A private international order of men dedicated to discipline, brotherhood, and generational legacy.
          </div>
        </div>

        {/* Institution Links */}
        <div>
          <h4 className="footer-column-title">Institution</h4>
          <ul className="footer-nav-list">
            <li><a href="#about">About The Club</a></li>
            <li><a href="#founder">The Founder's Journey</a></li>
            <li><a href="#vision">What We Build</a></li>
            <li><a href="#pillars">The Six Pillars</a></li>
            <li><a href="#system">Digital System</a></li>
          </ul>
        </div>

        {/* Brotherhood Links */}
        <div>
          <h4 className="footer-column-title">Brotherhood</h4>
          <ul className="footer-nav-list">
            <li><a href="#experience">Inside Sovereign</a></li>
            <li><a href="#events">Assemblies & Events</a></li>
            <li><a href="#who-for">Who Sovereign Is For</a></li>
            <li><a href="#membership">Membership Intake</a></li>
          </ul>
        </div>

        {/* Channels & Socials */}
        <div>
          <h4 className="footer-column-title">Presence & Channels</h4>
          <ul className="footer-nav-list">
            {FOOTER_DATA.socials.map((s) => (
              <li key={s.platform}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.platform} • {s.handle}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="footer-bottom-row">
        <div>
          © {FOOTER_DATA.copyrightYear} Sovereign Men's Club. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {FOOTER_DATA.legal.map((item) => (
            <button 
              key={item.label} 
              type="button"
              className="footer-legal-btn"
              onClick={() => onLegalClick?.(legalMap[item.label] || 'privacy')}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};
