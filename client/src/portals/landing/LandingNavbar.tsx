import React, { useState, useEffect } from 'react';
import { Shield, Menu, X, ArrowRight, LogIn } from 'lucide-react';
import { ThemeToggle } from '../../components/layout/ThemeToggle.js';

interface LandingNavbarProps {
  onSignInClick: () => void;
  onApplyClick: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onSignInClick, onApplyClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
      {/* Brand Anchor */}
      <a href="#hero" className="landing-nav-brand" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>
        <img src="/logo.png" alt="Sovereign Men's Club" className="logo-dark landing-nav-logo-img" />
        <img src="/logo-light.png" alt="Sovereign Men's Club" className="logo-light landing-nav-logo-img" />
        <span className="landing-nav-title">Sovereign</span>
      </a>

      {/* Desktop Navigation Links */}
      <nav aria-label="Main Navigation">
        <ul className="landing-nav-links">
          <li>
            <a href="#about" className="landing-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
              About
            </a>
          </li>
          <li>
            <a href="#founder" className="landing-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('founder'); }}>
              The Founder
            </a>
          </li>
          <li>
            <a href="#vision" className="landing-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('vision'); }}>
              The Goal
            </a>
          </li>
          <li>
            <a href="#system" className="landing-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('system'); }}>
              The System
            </a>
          </li>
          <li>
            <a href="#pillars" className="landing-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('pillars'); }}>
              Pillars
            </a>
          </li>
          <li>
            <a href="#events" className="landing-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('events'); }}>
              Events
            </a>
          </li>
          <li>
            <a href="#membership" className="landing-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('membership'); }}>
              Membership
            </a>
          </li>
        </ul>
      </nav>

      {/* Action Buttons & Theme Switcher */}
      <div className="landing-nav-actions">
        <ThemeToggle />

        <button
          type="button"
          className="btn-nav-signin"
          onClick={onSignInClick}
          aria-label="Member Sign In"
        >
          Sign In
        </button>

        <button
          type="button"
          className="btn-nav-cta"
          onClick={onApplyClick}
        >
          <span>Apply</span>
          <ArrowRight size={14} />
        </button>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="btn btn-icon"
          style={{ display: 'none' }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '76px',
          left: 0,
          right: 0,
          background: 'var(--landing-bg-surface)',
          borderBottom: '1px solid var(--landing-border-gold)',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 99,
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}>
          {['about', 'founder', 'vision', 'system', 'pillars', 'events', 'membership'].map((sec) => (
            <button
              key={sec}
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--landing-text-main)',
                fontSize: '0.95rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textAlign: 'left',
                padding: '8px 0',
                cursor: 'pointer'
              }}
              onClick={() => scrollToSection(sec)}
            >
              {sec.replace('-', ' ')}
            </button>
          ))}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() => { setMobileMenuOpen(false); onSignInClick(); }}
            >
              Member Sign In
            </button>
            <button
              type="button"
              className="btn btn-primary btn-gold-glow"
              style={{ flex: 1 }}
              onClick={() => { setMobileMenuOpen(false); onApplyClick(); }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
