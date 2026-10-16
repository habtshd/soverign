import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  BookOpen, 
  Hammer, 
  Award, 
  Flame, 
  HeartHandshake, 
  Target 
} from 'lucide-react';

export const LandingAbout: React.FC = () => {
  const verbs = [
    { label: "Connect", icon: Users, desc: "Forge lifelong alliances with vetted men of honor." },
    { label: "Learn", icon: BookOpen, desc: "Absorb deep masterclasses in capital, leadership, and craft." },
    { label: "Build", icon: Hammer, desc: "Construct durable enterprises, family legacies, and strong bodies." },
    { label: "Lead", icon: Award, desc: "Command yourself first before leading household or nation." },
    { label: "Challenge", icon: Flame, desc: "Step voluntarily into physical and mental crucibles." },
    { label: "Support", icon: HeartHandshake, desc: "Lift a fallen brother and demand his immediate return to post." },
    { label: "Pursue", icon: Target, desc: "Direct your daily hours toward generational, worthy missions." }
  ];

  return (
    <section id="about" className="landing-section">
      <div className="landing-section-header">
        <span className="landing-section-badge">The Sovereign Thesis</span>
        <h2 className="landing-section-title">More Than a Club.</h2>
        <p className="landing-section-subtitle">
          A structured community and personal-development ecosystem built around meaningful relationships, unflinching accountability, timeless learning, rigorous discipline, and long-term growth.
        </p>
      </div>

      <div className="about-comparison-grid">
        {/* The Modern Dilemma */}
        <div className="about-problem-box">
          <div className="about-problem-label">
            <AlertTriangle size={15} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            The Modern Predicament
          </div>
          <h3 className="about-problem-title">Isolation, Distraction, and Decay</h3>
          <p className="about-problem-text">
            Modern civilization offers unprecedented comfort while subtly starving men of meaning. Men are connected by thousands of digital signals yet remain profoundly isolated. 
          </p>
          <p className="about-problem-text" style={{ marginTop: '12px' }}>
            Without brothers who demand accountability, without daily physical standards, and without a guiding generational purpose, masculine vitality dissolves into passive consumption, broken promises, and quiet regret.
          </p>
        </div>

        {/* The Sovereign Response */}
        <div className="about-solution-box">
          <div className="about-solution-label">
            <CheckCircle2 size={15} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            The Sovereign Order
          </div>
          <h3 className="about-solution-title">The Brotherhood Built to Build You</h3>
          <p className="about-problem-text">
            Sovereign Men's Club answers with an unyielding environment of structure, brotherhood, and execution. Here, men refuse to settle for passive survival.
          </p>

          <div className="about-verbs-grid">
            {verbs.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.label} className="about-verb-chip" title={v.desc}>
                  <Icon size={16} className="text-gold" />
                  <span>{v.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
