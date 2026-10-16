import React from 'react';
import { Shield, ArrowRight, Compass, ChevronDown } from 'lucide-react';
import { BRAND_CONFIG } from './landing.data.js';

interface LandingHeroProps {
  onApplyClick: () => void;
  onExploreClick: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onApplyClick, onExploreClick }) => {
  return (
    <section id="hero" className="landing-hero-section">
      {/* Ambient Pulsing Light Glow */}
      <div className="hero-bg-lights" />

      <div className="hero-content">
        <img 
          src="/logo.png" 
          alt="Sovereign Men's Club Crest" 
          className="logo-dark hero-crest-logo" 
        />
        <img 
          src="/logo-light.png" 
          alt="Sovereign Men's Club Crest" 
          className="logo-light hero-crest-logo" 
        />

        {/* Master Headline */}
        <h1 className="hero-main-headline">
          Sovereign<br />Men’s Club
        </h1>

        {/* Supporting Statement */}
        <p className="hero-supporting-statement">
          "{BRAND_CONFIG.tagline}"
        </p>

        {/* Description */}
        <p className="hero-description">
          {BRAND_CONFIG.description}
        </p>

        {/* Action CTAs */}
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
            <span>Explore The Club</span>
            <Compass size={17} />
          </button>
        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div 
        className="hero-scroll-indicator"
        onClick={onExploreClick}
        role="button"
        tabIndex={0}
      >
        <span>Discover The Standard</span>
        <ChevronDown size={14} />
      </div>
    </section>
  );
};
