import React from 'react';
import { ArrowDown, Cpu, ShieldCheck, Zap } from 'lucide-react';
import { THE_SOVEREIGN_SYSTEM } from './landing.data.js';

export const LandingSystem: React.FC = () => {
  return (
    <section id="system" className="landing-section">
      <div className="landing-section-header">
        <span className="landing-section-badge">Integrated Digital Architecture</span>
        <h2 className="landing-section-title">{THE_SOVEREIGN_SYSTEM.title}</h2>
        <p className="landing-section-subtitle">
          {THE_SOVEREIGN_SYSTEM.subtitle}
        </p>
      </div>

      {/* System Flow Diagram Chain */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '24px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--landing-border-gold)',
        borderRadius: '16px',
        marginBottom: '40px'
      }}>
        {THE_SOVEREIGN_SYSTEM.nodes.map((node, index) => (
          <React.Fragment key={node.id}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'var(--landing-bg-surface)',
              border: '1px solid var(--landing-border)',
              fontFamily: 'var(--landing-font-mono)',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--landing-text-main)',
              letterSpacing: '0.08em'
            }}>
              <span style={{ color: 'var(--landing-gold)' }}>0{index + 1}</span>
              <span>{node.label}</span>
            </div>
            {index < THE_SOVEREIGN_SYSTEM.nodes.length - 1 && (
              <span style={{ color: 'var(--landing-border-gold)', fontWeight: 800 }}>→</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Comprehensive Node Grid */}
      <div className="system-architecture-flow">
        {THE_SOVEREIGN_SYSTEM.nodes.map((node) => (
          <div key={node.id} className="system-node-card">
            <div className="system-node-header">
              <span className="system-node-title">{node.label}</span>
              <span className={`system-node-status ${node.status === 'COMING_SOON' ? 'coming-soon' : ''}`}>
                {node.status === 'ACTIVE' ? 'LIVE MODULE' : 'COMING SOON'}
              </span>
            </div>
            <p className="system-node-desc">
              {node.description}
            </p>
          </div>
        ))}
      </div>

      {/* Feature Capabilities Banner */}
      <div style={{
        marginTop: '36px',
        padding: '20px 24px',
        borderRadius: '12px',
        background: 'rgba(212, 175, 55, 0.04)',
        border: '1px dashed var(--landing-border-gold)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldCheck size={22} className="text-gold" />
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--landing-text-main)' }}>
            Real-time synchronization across Member Profiles, Digital IDs, and Leadership Verification.
          </span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--landing-text-muted)' }}>
          Powered by Sovereign OS Core Engine
        </div>
      </div>
    </section>
  );
};
