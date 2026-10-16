import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  X, 
  FileText, 
  Flame, 
  Users2, 
  Lock, 
  CheckCircle2, 
  Award,
  ChevronRight
} from 'lucide-react';

export type LegalDocType = 'privacy' | 'terms' | 'agreement' | 'readiness';

interface LandingLegalModalProps {
  initialTab: LegalDocType;
  onClose: () => void;
}

export const LandingLegalModal: React.FC<LandingLegalModalProps> = ({ initialTab, onClose }) => {
  const [activeTab, setActiveTab] = useState<LegalDocType>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const tabs: { id: LegalDocType; label: string; icon: React.ReactNode }[] = [
    { id: 'privacy', label: 'Privacy Policy', icon: <Lock size={15} /> },
    { id: 'terms', label: 'Brotherhood Terms', icon: <Users2 size={15} /> },
    { id: 'agreement', label: 'Membership Agreement', icon: <FileText size={15} /> },
    { id: 'readiness', label: 'Readiness Code', icon: <Flame size={15} /> }
  ];

  return (
    <div 
      className="modal-overlay" 
      style={{ zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="modal-content legal-modal-container" 
        style={{
          maxWidth: '820px',
          width: '100%',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          borderRadius: '16px',
          background: 'var(--landing-bg-surface)',
          border: '1px solid var(--landing-border-gold)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '24px 28px 16px 28px',
          borderBottom: '1px solid var(--landing-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(212, 175, 55, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid var(--landing-border-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--landing-gold)'
            }}>
              <Shield size={20} />
            </div>
            <div>
              <h3 style={{
                fontFamily: 'var(--landing-font-serif)',
                fontSize: '1.15rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                color: 'var(--landing-text-main)',
                margin: 0,
                textTransform: 'uppercase'
              }}>
                Institutional Charters & Covenants
              </h3>
              <p style={{
                fontSize: '0.76rem',
                color: 'var(--landing-text-muted)',
                margin: '2px 0 0 0'
              }}>
                Sovereign Men's Club • Official Governance & Legal Protocols
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'transparent',
              border: '1px solid var(--landing-border)',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--landing-text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--landing-border)',
          background: 'rgba(0, 0, 0, 0.05)',
          overflowX: 'auto',
          padding: '0 16px'
        }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 18px',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--landing-gold)' : '2px solid transparent',
                  color: isActive ? 'var(--landing-gold)' : 'var(--landing-text-muted)',
                  fontFamily: 'var(--landing-font-heading)',
                  fontSize: '0.84rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Scrollable Document Body */}
        <div style={{
          padding: '28px 32px',
          overflowY: 'auto',
          flex: 1,
          lineHeight: 1.7,
          color: 'var(--landing-text-main)',
          fontSize: '0.9rem'
        }}>
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <span className="landing-section-badge" style={{ fontSize: '0.68rem', padding: '4px 12px' }}>
                  Charter Protocol • Rev. 2026.1
                </span>
                <h2 style={{
                  fontFamily: 'var(--landing-font-serif)',
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  margin: '8px 0',
                  color: 'var(--landing-text-main)'
                }}>
                  Data Sovereignty & Privacy Policy
                </h2>
                <p style={{ color: 'var(--landing-text-muted)', fontSize: '0.84rem' }}>
                  Effective Date: January 1, 2026 • Sovereign Men's Club International
                </p>
              </div>

              <div style={{
                background: 'rgba(212, 175, 55, 0.05)',
                borderLeft: '3px solid var(--landing-gold)',
                padding: '14px 18px',
                borderRadius: '0 8px 8px 0',
                marginBottom: '24px',
                fontSize: '0.86rem',
                color: 'var(--landing-text-muted)'
              }}>
                <strong>The Sovereign Guarantee:</strong> We reject the surveillance economy. We will never sell, broker, monetize, or harvest your personal information, responses, or conclave discussions. Your word and identity are defended with sovereign discretion.
              </div>

              <h4 style={{ color: 'var(--landing-gold)', marginTop: '22px', fontSize: '1rem', fontFamily: 'var(--landing-font-heading)' }}>
                1. Principle of Absolute Discretion
              </h4>
              <p style={{ color: 'var(--landing-text-muted)' }}>
                Sovereign Men's Club operates under strict fraternal confidentiality. Information submitted through readiness questionnaires, member verification portals, and inner council dossiers is held under cryptographic security and accessible strictly by designated presiding council officers.
              </p>

              <h4 style={{ color: 'var(--landing-gold)', marginTop: '22px', fontSize: '1rem', fontFamily: 'var(--landing-font-heading)' }}>
                2. Information Gathered
              </h4>
              <p style={{ color: 'var(--landing-text-muted)' }}>
                We collect only what is strictly necessary to maintain order, safety, and authentic fraternal accountability:
              </p>
              <ul style={{ paddingLeft: '20px', color: 'var(--landing-text-muted)', fontSize: '0.86rem' }}>
                <li><strong>Identity Records:</strong> Legal name, Sovereign Identifier (e.g. MAN 001), secure communications handle, and city of residence.</li>
                <li><strong>Readiness Dossier:</strong> Honest disclosures from the 38-question assessment regarding physical habits, career trajectory, mental discipline, and leadership readiness.</li>
                <li><strong>Participation Metrics:</strong> Assembly attendance, cohort milestones, mutual aid tracking, and physical checkpoint completions.</li>
              </ul>

              <h4 style={{ color: 'var(--landing-gold)', marginTop: '22px', fontSize: '1rem', fontFamily: 'var(--landing-font-heading)' }}>
                3. Sanctity of Conclave Discussions
              </h4>
              <p style={{ color: 'var(--landing-text-muted)' }}>
                All discussions occurring within closed conclaves, squad calls, physical camps, or private communications channels are strictly off-the-record. The unauthorized recording, transcription, screenshotting, or leak of private discussions is grounds for immediate, dishonorable expulsion.
              </p>

              <h4 style={{ color: 'var(--landing-gold)', marginTop: '22px', fontSize: '1rem', fontFamily: 'var(--landing-font-heading)' }}>
                4. The Right to Complete Erasure
              </h4>
              <p style={{ color: 'var(--landing-text-muted)' }}>
                Any member in good standing who voluntarily tenders an honorable resignation may petition for the permanent, irreversible destruction of their application answers and personal records from all digital ledgers.
              </p>
            </div>
          )}

          {/* TAB 2: BROTHERHOOD TERMS */}
          {activeTab === 'terms' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <span className="landing-section-badge" style={{ fontSize: '0.68rem', padding: '4px 12px' }}>
                  Institutional Covenant
                </span>
                <h2 style={{
                  fontFamily: 'var(--landing-font-serif)',
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  margin: '8px 0',
                  color: 'var(--landing-text-main)'
                }}>
                  Brotherhood Terms & Covenant
                </h2>
                <p style={{ color: 'var(--landing-text-muted)', fontSize: '0.84rem' }}>
                  Ratified by the Sovereign Council of Elders • Standard of Association
                </p>
              </div>

              <div style={{
                background: 'rgba(212, 175, 55, 0.05)',
                borderLeft: '3px solid var(--landing-gold)',
                padding: '14px 18px',
                borderRadius: '0 8px 8px 0',
                marginBottom: '24px',
                fontSize: '0.86rem',
                color: 'var(--landing-text-muted)'
              }}>
                <strong>The Living Law:</strong> Sovereign Men's Club is not a casual networking group or recreational discord. It is a fraternity bound by integrity, truth in speech, and mutual defense.
              </div>

              <h4 style={{ color: 'var(--landing-gold)', marginTop: '22px', fontSize: '1rem', fontFamily: 'var(--landing-font-heading)' }}>
                1. Ironclad Inviolability of One's Word
              </h4>
              <p style={{ color: 'var(--landing-text-muted)' }}>
                A Sovereign brother’s word is a sacred contract. If you state you will be somewhere, you must be there. If you commit to carry a load, you carry it to completion. Flakiness, chronic unpunctuality, and deceit are antithetical to the Sovereign ethos.
              </p>

              <h4 style={{ color: 'var(--landing-gold)', marginTop: '22px', fontSize: '1rem', fontFamily: 'var(--landing-font-heading)' }}>
                2. Prohibition of Predatory Solicitation
              </h4>
              <p style={{ color: 'var(--landing-text-muted)' }}>
                The conclave is not a sales target list. Direct marketing schemes, multi-level marketing solicitations, speculative token launches, or manipulative financial harvesting directed at brothers will result in immediate removal. Genuine commercial syndicates and mutual patronages must be rooted in superior craft, transparent accounting, and mutual consent.
              </p>

              <h4 style={{ color: 'var(--landing-gold)', marginTop: '22px', fontSize: '1rem', fontFamily: 'var(--landing-font-heading)' }}>
                3. Direct Confrontation and Conflict Resolution
              </h4>
              <p style={{ color: 'var(--landing-text-muted)' }}>
                We abhor gossip, cowardly whisper networks, and passive-aggressive behavior. If a brother has a dispute with another brother, he must approach him directly and courageously in private. If resolution fails, the issue is submitted before the Conclave Elders whose determination is conclusive.
              </p>

              <h4 style={{ color: 'var(--landing-gold)', marginTop: '22px', fontSize: '1rem', fontFamily: 'var(--landing-font-heading)' }}>
                4. Public Representation
              </h4>
              <p style={{ color: 'var(--landing-text-muted)' }}>
                Wherever a brother walks—in business, in his home, in his civil community—he represents the standard of Sovereign Men's Club. Conduct characterized by cowardice, physical degeneracy, or moral depravity damages the entire brotherhood and triggers formal council discipline.
              </p>
            </div>
          )}

          {/* TAB 3: MEMBERSHIP AGREEMENT */}
          {activeTab === 'agreement' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <span className="landing-section-badge" style={{ fontSize: '0.68rem', padding: '4px 12px' }}>
                  Conclave Treaty
                </span>
                <h2 style={{
                  fontFamily: 'var(--landing-font-serif)',
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  margin: '8px 0',
                  color: 'var(--landing-text-main)'
                }}>
                  Sovereign Membership Agreement
                </h2>
                <p style={{ color: 'var(--landing-text-muted)', fontSize: '0.84rem' }}>
                  Formal Undertaking Between the Member and Sovereign Men's Club
                </p>
              </div>

              <div style={{
                background: 'rgba(212, 175, 55, 0.05)',
                borderLeft: '3px solid var(--landing-gold)',
                padding: '14px 18px',
                borderRadius: '0 8px 8px 0',
                marginBottom: '24px',
                fontSize: '0.86rem',
                color: 'var(--landing-text-muted)'
              }}>
                <strong>Obligation of Active Elevation:</strong> There are no spectator tiers in Sovereign Men's Club. By signing or confirming your membership, you agree to step onto the proving ground.
              </div>

              <h4 style={{ color: 'var(--landing-gold)', marginTop: '22px', fontSize: '1rem', fontFamily: 'var(--landing-font-heading)' }}>
                1. The Active Participation Mandate
              </h4>
              <p style={{ color: 'var(--landing-text-muted)' }}>
                Members must maintain minimum attendance at weekly digital council sessions, quarterly tactical intensives, and assigned accountability pods. Failure to engage for 30 consecutive days without formal leave of absence results in automatic transition to Inactive Candidate status.
              </p>

              <h4 style={{ color: 'var(--landing-gold)', marginTop: '22px', fontSize: '1rem', fontFamily: 'var(--landing-font-heading)' }}>
                2. Financial Stewardship & Dues
              </h4>
              <p style={{ color: 'var(--landing-text-muted)' }}>
                Membership contributions sustain club operations, proprietary digital systems, physical gathering venues, expedition logistics, and the Sovereign Emergency Mutual Defense Fund. Dues must be discharged punctually as a point of honor and economic self-mastery.
              </p>

              <h4 style={{ color: 'var(--landing-gold)', marginTop: '22px', fontSize: '1rem', fontFamily: 'var(--landing-font-heading)' }}>
                3. Physical Readiness Audits
              </h4>
              <p style={{ color: 'var(--landing-text-muted)' }}>
                Every enrolled brother is expected to submit to periodic physical performance assessments (ruck endurance, body composition, cardiovascular fortitude, and tactical competence). We build men of resilience, not theoretical philosophers.
              </p>

              <h4 style={{ color: 'var(--landing-gold)', marginTop: '22px', fontSize: '1rem', fontFamily: 'var(--landing-font-heading)' }}>
                4. Honorable Exit Protocol
              </h4>
              <p style={{ color: 'var(--landing-text-muted)' }}>
                Should a man determine that the standards of Sovereign Men's Club no longer align with his personal path, he may tender an honorable resignation in writing. All non-disclosure and conclave secrecy covenants remain binding in perpetuity.
              </p>
            </div>
          )}

          {/* TAB 4: READINESS CODE */}
          {activeTab === 'readiness' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <span className="landing-section-badge" style={{ fontSize: '0.68rem', padding: '4px 12px' }}>
                  The 7 Tenets
                </span>
                <h2 style={{
                  fontFamily: 'var(--landing-font-serif)',
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  margin: '8px 0',
                  color: 'var(--landing-text-main)'
                }}>
                  The Sovereign Readiness Code
                </h2>
                <p style={{ color: 'var(--landing-text-muted)', fontSize: '0.84rem' }}>
                  The Bedrock Standards Every Sovereign Aspirant and Brother Must Embody
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                {[
                  {
                    title: "Tenet I: Radical Self-Governance",
                    desc: "Before a man can command a family, a business, or an assembly, he must conquer himself. Zero victimhood. Total ownership of every outcome."
                  },
                  {
                    title: "Tenet II: Physical Lethality & Endurance",
                    desc: "A weak body betrays a undisciplined spirit. Train relentlessly, eat with intention, and build a vessel that can withstand physical hardship and defend the vulnerable."
                  },
                  {
                    title: "Tenet III: Economic Sovereignty",
                    desc: "Eliminate frivolous debt and dependency on fragile systems. Build enterprise, master capital, and establish intergenerational assets that outlast your lifetime."
                  },
                  {
                    title: "Tenet IV: Absolute Veracity in Speech",
                    desc: "Speak only what is truthful, deliberate, and courageous. A Sovereign man never speaks ill of his brothers behind their backs and never promises what he will not fulfill."
                  },
                  {
                    title: "Tenet V: Emotional Composure Under Fire",
                    desc: "Panic is the weapon of the unprepared. When catastrophe strikes, the Sovereign man becomes the immovable rock upon which his dependents anchor."
                  },
                  {
                    title: "Tenet VI: Fierce Brotherhood & Loyalty",
                    desc: "Refuse to let a brother slip into decay. Challenge him when he compromises, defend him when he is besieged, and celebrate him when he breaks through."
                  },
                  {
                    title: "Tenet VII: Generational Legacy",
                    desc: "Live not for momentary gratification, but for the sons and daughters who will carry your bloodline forward. Build institutions that endure."
                  }
                ].map((tenet, idx) => (
                  <div 
                    key={tenet.title}
                    style={{
                      padding: '16px 20px',
                      borderRadius: '10px',
                      background: 'rgba(212, 175, 55, 0.04)',
                      border: '1px solid var(--landing-border)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <CheckCircle2 size={16} color="var(--landing-gold)" />
                      <h4 style={{
                        fontFamily: 'var(--landing-font-heading)',
                        fontSize: '0.96rem',
                        fontWeight: 800,
                        color: 'var(--landing-gold)',
                        margin: 0
                      }}>
                        {tenet.title}
                      </h4>
                    </div>
                    <p style={{
                      fontSize: '0.84rem',
                      lineHeight: 1.6,
                      color: 'var(--landing-text-muted)',
                      margin: 0
                    }}>
                      {tenet.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 28px',
          borderTop: '1px solid var(--landing-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(0, 0, 0, 0.04)',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--landing-text-subtle)' }}>
            Sovereign Men's Club • All Charters Legally Protected Under International Jurisdiction
          </span>
          <button
            type="button"
            className="btn-landing-primary"
            onClick={onClose}
            style={{ padding: '10px 22px', fontSize: '0.84rem' }}
          >
            I Acknowledge & Understand
          </button>
        </div>
      </div>
    </div>
  );
};
