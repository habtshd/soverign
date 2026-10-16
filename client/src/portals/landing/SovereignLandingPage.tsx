import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { 
  X, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight, 
  Loader2, 
  Shield 
} from 'lucide-react';

// Landing Sections
import { LandingNavbar } from './LandingNavbar.js';
import { LandingHero } from './LandingHero.js';
import { LandingAbout } from './LandingAbout.js';
import { LandingFounder } from './LandingFounder.js';
import { LandingVisionPath } from './LandingVisionPath.js';
import { LandingSystem } from './LandingSystem.js';
import { LandingExperience } from './LandingExperience.js';
import { LandingPillars } from './LandingPillars.js';
import { LandingBrotherhood } from './LandingBrotherhood.js';
import { LandingEvents } from './LandingEvents.js';
import { LandingJourneyScroll } from './LandingJourneyScroll.js';
import { LandingWhoFor } from './LandingWhoFor.js';
import { LandingMembership } from './LandingMembership.js';
import { LandingFounderMessage } from './LandingFounderMessage.js';
import { LandingFutureVision } from './LandingFutureVision.js';
import { LandingFinalCta } from './LandingFinalCta.js';
import { LandingFooter } from './LandingFooter.js';
import { LandingLegalModal, LegalDocType } from './LandingLegalModal.js';

// The Authentic 38-Question Readiness Application Wizard
import { SovereignReadinessWizard } from '../public/SovereignReadinessWizard.js';

interface SovereignLandingPageProps {
  onSuccess: () => void;
}

export const SovereignLandingPage: React.FC<SovereignLandingPageProps> = ({ onSuccess }) => {
  const { login } = useAuth();

  // Modal states: null | 'SIGN_IN' | 'APPLY'
  const [activeModal, setActiveModal] = useState<'SIGN_IN' | 'APPLY' | null>(null);
  const [legalModalDoc, setLegalModalDoc] = useState<LegalDocType | null>(null);

  // Sign In Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    try {
      const success = await login(loginEmail, loginPassword);
      if (success) {
        setActiveModal(null);
        onSuccess();
      } else {
        setLoginError('Invalid Sovereign Identifier or password. Please verify your credentials.');
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const handleDemoLogin = async (identifier: string, pass: string) => {
    setLoginError(null);
    setLoggingIn(true);
    setLoginEmail(identifier);
    setLoginPassword(pass);
    try {
      const success = await login(identifier, pass);
      if (success) {
        setActiveModal(null);
        onSuccess();
      } else {
        setLoginError('Could not authenticate demo credentials.');
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const handleWizardSuccess = async ({ email, pass }: { email: string; pass: string }) => {
    try {
      await login(email, pass);
      setActiveModal(null);
      onSuccess();
    } catch (err) {
      setActiveModal('SIGN_IN');
      setLoginEmail(email);
    }
  };

  // Masculine Kinetic Scroll Dynamics & Discipline Tracker
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // 1. Scroll Discipline Progress Laser
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        const pct = Math.min(100, Math.max(0, (window.scrollY / total) * 100));
        setScrollProgress(pct);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 2. Ironclad Intersection Observer for Masculine Physics
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('iron-revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.08
      }
    );

    // Target all cards, section headers, vision rows, and structural elements
    const revealTargets = document.querySelectorAll(
      '.landing-section-header, .about-problem-box, .about-solution-box, ' +
      '.founder-portrait-card, .founder-timeline-node, .vision-step-row, ' +
      '.system-node-card, .experience-step-card, .pillar-card, ' +
      '.brotherhood-atmosphere-card, .brotherhood-dimension-card, ' +
      '.event-timeline-card, .who-for-card, .membership-pipeline-flow, ' +
      '.founder-message-card, .vision-area-card, .final-cta-content'
    );

    revealTargets.forEach((node) => {
      node.classList.add('iron-reveal-init');
      observer.observe(node);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToExplore = () => {
    const el = document.getElementById('about');
    if (el) {
      const navOffset = 70;
      const elPos = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top: elPos, behavior: 'smooth' });
    }
  };

  const scrollToVision = () => {
    const el = document.getElementById('vision');
    if (el) {
      const navOffset = 70;
      const elPos = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top: elPos, behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-master-container">
      {/* Scroll Discipline Laser Tracker */}
      <div 
        className="scroll-discipline-tracker" 
        style={{ width: `${scrollProgress}%` }} 
      />

      {/* Background ambient lighting */}
      <div className="landing-ambient-layer" />

      {/* Floating Navigation */}
      <LandingNavbar
        onSignInClick={() => { setLoginError(null); setActiveModal('SIGN_IN'); }}
        onApplyClick={() => setActiveModal('APPLY')}
      />

      {/* 1. Hero Section */}
      <LandingHero
        onApplyClick={() => setActiveModal('APPLY')}
        onExploreClick={scrollToExplore}
      />

      {/* 2. What is Sovereign Men's Club? */}
      <LandingAbout />

      {/* 3. The Founder's Journey */}
      <LandingFounder />

      {/* 4. The Goal (What Are We Building?) */}
      <LandingVisionPath />

      {/* 5. The Sovereign System */}
      <LandingSystem />

      {/* 6. What Members Experience (Inside Sovereign) */}
      <LandingExperience />

      {/* 7. The Six Pillars */}
      <LandingPillars />

      {/* 8. Community / Brotherhood */}
      <LandingBrotherhood />

      {/* 9. Events & Experiences */}
      <LandingEvents />

      {/* 10. The Lifelong Journey */}
      <LandingJourneyScroll />

      {/* 11. Who Is It For? */}
      <LandingWhoFor />

      {/* 12. Membership Intake */}
      <LandingMembership onApplyClick={() => setActiveModal('APPLY')} />

      {/* 13. Founder's Message */}
      <LandingFounderMessage />

      {/* 14. Future Vision */}
      <LandingFutureVision />

      {/* 15. Final CTA */}
      <LandingFinalCta
        onApplyClick={() => setActiveModal('APPLY')}
        onExploreClick={scrollToVision}
      />

      {/* 16. Footer */}
      <LandingFooter onLegalClick={(doc) => setLegalModalDoc(doc)} />

      {/* ================================================================== */}
      {/* MODAL: INSTITUTIONAL LEGAL COVENANTS & CHARTERS                   */}
      {/* ================================================================== */}
      {legalModalDoc && (
        <LandingLegalModal
          initialTab={legalModalDoc}
          onClose={() => setLegalModalDoc(null)}
        />
      )}

      {/* ================================================================== */}
      {/* MODAL: SIGN IN TO SOVEREIGN COMMAND CENTER                        */}
      {/* ================================================================== */}
      {activeModal === 'SIGN_IN' && (
        <div className="modal-overlay" style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content" style={{ maxWidth: '440px', width: '100%', padding: '32px 28px', position: 'relative' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={20} className="text-gold" />
                <h3 style={{ fontFamily: 'var(--landing-font-serif)', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--landing-text-main)', margin: 0 }}>
                  Member Sign In
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                style={{ background: 'none', border: 'none', color: 'var(--landing-text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
                aria-label="Close Modal"
              >
                ✕
              </button>
            </div>

            {loginError && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#ef4444',
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '0.83rem',
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label className="auth-field-label">Sovereign Identifier / Email</label>
                <div className="auth-input-container">
                  <span className="auth-input-icon">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    className="auth-text-input"
                    placeholder="Member ID (e.g. MAN 001) or Email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="auth-field-label">Passkey</label>
                <div className="auth-input-container">
                  <span className="auth-input-icon">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="auth-text-input"
                    placeholder="••••••••••••"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="auth-toggle-pwd-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loggingIn}
              >
                {loggingIn ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Verifying Conclave Standing...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Command Center</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Fill Buttons */}
            <div style={{ marginTop: '22px', paddingTop: '16px', borderTop: '1px solid var(--landing-border)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--landing-gold)', marginBottom: '8px' }}>
                Quick Demo Access
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  style={{ fontSize: '0.72rem', padding: '6px 8px' }}
                  onClick={() => handleDemoLogin('admin@sovereign.club', 'Password123!')}
                >
                  Founder (Admin)
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  style={{ fontSize: '0.72rem', padding: '6px 8px' }}
                  onClick={() => handleDemoLogin('habtemariam@sovereign.club', 'Password123!')}
                >
                  Council Architect
                </button>
              </div>
            </div>

            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--landing-text-muted)' }}>
                Not yet a member?{' '}
              </span>
              <button
                type="button"
                style={{ background: 'none', border: 'none', color: 'var(--landing-gold)', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => setActiveModal('APPLY')}
              >
                Apply for Membership
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL: 38-QUESTION SOVEREIGN READINESS APPLICATION                 */}
      {/* ================================================================== */}
      {activeModal === 'APPLY' && (
        <div className="modal-overlay" style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="modal-content" style={{ maxWidth: '860px', width: '100%', maxHeight: '92vh', overflowY: 'auto', padding: '32px 30px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--landing-border)', paddingBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--landing-gold)' }}>
                  Sovereign Men's Club Intake Protocol
                </div>
                <h3 style={{ fontFamily: 'var(--landing-font-serif)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--landing-text-main)', margin: '2px 0 0 0' }}>
                  Registration & Readiness Application
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                style={{ background: 'none', border: 'none', color: 'var(--landing-text-muted)', cursor: 'pointer', fontSize: '1.3rem' }}
                aria-label="Close Application"
              >
                ✕
              </button>
            </div>

            {/* Embedded 38-Question Readiness Wizard */}
            <SovereignReadinessWizard
              onSuccess={handleWizardSuccess}
              onCancel={() => setActiveModal(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
