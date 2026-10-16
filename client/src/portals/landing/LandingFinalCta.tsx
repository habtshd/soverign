import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';

interface LandingFinalCtaProps {
  onApplyClick: () => void;
  onExploreClick: () => void;
}

export const LandingFinalCta: React.FC<LandingFinalCtaProps> = ({ onApplyClick, onExploreClick }) => {
  return (
    <section className="landing-final-cta-section">
      {/* Slow Ambient Logo Backdrop */}
      <img
        src="/logo.png"
        alt="Sovereign Crest Backdrop"
        className="logo-dark final-cta-logo-backdrop"
      />
      <img
        src="/logo-light.png"
        alt="Sovereign Crest Backdrop"
        className="logo-light final-cta-logo-backdrop"
      />

      <div className="final-cta-content">
        <h2 className="final-cta-headline">
          Your Journey Starts With A Decision.
        </h2>

        <p className="final-cta-subtext">
          "Sovereignty is not given. It is built."
        </p>

        <p style={{
          fontSize: '1rem',
          lineHeight: 1.7,
          color: 'var(--landing-text-muted)',
          maxWidth: '620px',
          margin: '0 auto 40px auto'
        }}>
          Every day you delay discipline is a day claimed by comfort. Answer the call, complete your readiness screening, and forge your legacy among brothers who will not let you fail.
        </p>

        <div className="hero-cta-group">
          <button
            type="button"
            className="btn-hero-primary"
            onClick={onApplyClick}
          >
            <span>Become A Member</span>
            <ArrowRight size={17} />
          </button>

          <button
            type="button"
            className="btn-hero-secondary"
            onClick={onExploreClick}
          >
            <span>Explore The Vision</span>
            <Compass size={17} />
          </button>
        </div>
      </div>
    </section>
  );
};
