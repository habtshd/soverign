import React from 'react';
import { Shield, ArrowRight, FileCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface LandingMembershipProps {
  onApplyClick: () => void;
}

export const LandingMembership: React.FC<LandingMembershipProps> = ({ onApplyClick }) => {
  const steps = [
    { num: "01", name: "Discover", desc: "Understand our ethos, non-negotiables, and high standard." },
    { num: "02", name: "Apply / Register", desc: "Complete the authentic 38-question Sovereign Readiness Application." },
    { num: "03", name: "Profile", desc: "Council assigns your unique MAN identifier and digital member card." },
    { num: "04", name: "Welcome", desc: "Receive orientation, review brotherhood covenants, and join squad." },
    { num: "05", name: "Enter Conclave", desc: "Take your place in active training, masterminds, and events." }
  ];

  return (
    <section id="membership" className="landing-section">
      <div className="landing-section-header">
        <span className="landing-section-badge">Intake & Covenant</span>
        <h2 className="landing-section-title">Your Place in the Brotherhood</h2>
        <p className="landing-section-subtitle">
          Sovereign Men's Club is an active brotherhood, not a passive digital chatroom. Every aspirant passes through deliberate intake screening before entering the ranks.
        </p>
      </div>

      {/* 5-Step Process Pipeline */}
      <div className="membership-pipeline-flow">
        {steps.map((st) => (
          <div key={st.num} className="membership-pipeline-node">
            <div className="membership-node-circle">{st.num}</div>
            <div className="membership-node-label">{st.name}</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--landing-text-muted)', marginTop: '4px' }}>
              {st.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Advisory Banner: No Guaranteed Acceptance */}
      <div style={{
        background: 'rgba(212, 175, 55, 0.05)',
        border: '1px solid var(--landing-border-gold)',
        borderRadius: '14px',
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', maxWidth: '640px' }}>
          <AlertCircle size={22} className="text-gold" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ 
              fontFamily: 'var(--landing-font-heading)', 
              fontSize: '1rem', 
              fontWeight: 800, 
              color: 'var(--landing-text-main)', 
              margin: '0 0 4px 0' 
            }}>
              Intake Screening & Readiness Standard
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--landing-text-muted)', margin: 0, lineHeight: 1.55 }}>
              Submitting an application does not guarantee acceptance. Strong-looking answers are less valuable than truthful answers. We assess genuine willingness to take responsibility, accept correction, and do the work.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn-hero-primary"
          style={{ padding: '12px 24px', fontSize: '0.84rem' }}
          onClick={onApplyClick}
        >
          <span>Begin Application (38 Questions)</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
};
