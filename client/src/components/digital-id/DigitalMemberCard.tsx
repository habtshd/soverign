import React, { useState } from 'react';
import { Shield, QrCode, Award, Clock } from 'lucide-react';

interface DigitalMemberCardProps {
  memberNumber: string;
  digitalIdCode: string;
  name: string;
  tier: string;
  badgeTier?: string;
  joinDate?: string;
  serviceHours?: number;
  qrCodeUrl?: string;
}

export const DigitalMemberCard: React.FC<DigitalMemberCardProps> = ({
  memberNumber,
  digitalIdCode,
  name,
  tier,
  badgeTier = 'STANDARD',
  joinDate,
  serviceHours = 0,
  qrCodeUrl,
}) => {
  const [showQR, setShowQR] = useState(false);

  const qrImage =
    qrCodeUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
      digitalIdCode || memberNumber
    )}`;

  // Format member number cleanly (e.g. SOV · 014)
  const displayMemberNumber = (memberNumber || 'SOV-001')
    .toUpperCase()
    .replace(/^PR\/[A-Z0-9_-]+\/([0-9]+)$/i, 'SOV · $1')
    .replace(/-/g, ' · ');

  return (
    <div className="digital-id-container">
      <div className="digital-card">
        {/* Simple Non-overlapping Minimalist Contour Lines in Empty Space */}
        <svg
          className="card-guilloche-bg"
          viewBox="0 0 440 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="simpleLineGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--gold-400)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--gold-400)" stopOpacity="0.03" />
            </linearGradient>
            <linearGradient id="topLineGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--gold-400)" stopOpacity="0.04" />
              <stop offset="50%" stopColor="var(--gold-400)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--gold-400)" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          {/* Bottom-left empty space curves (below badge, away from Atlas & text) */}
          <g stroke="url(#simpleLineGold)" strokeWidth="0.8" fill="none">
            <path d="M -10,215 C 35,212 80,225 140,255" />
            <path d="M -10,228 C 35,225 75,237 120,265" />
            <path d="M -10,241 C 30,238 65,249 95,275" />
          </g>

          {/* Top-edge corner arches (anchored into the top border, zero floating ends) */}
          <g stroke="url(#simpleLineGold)" strokeWidth="0.8" fill="none">
            <path d="M 175,-10 C 215,22 280,22 320,-10" />
            <path d="M 195,-10 C 225,12 270,12 300,-10" />
            <path d="M 215,-10 C 235,5 260,5 280,-10" />
          </g>

          {/* Top-right corner curves (hugging the top-right corner above the chip) */}
          <g stroke="url(#simpleLineGold)" strokeWidth="0.8" fill="none">
            <path d="M 345,-10 C 385,16 420,22 450,18" />
            <path d="M 370,-10 C 400,8 430,12 450,6" />
          </g>
        </svg>

        {/* Artistic Embedded Muscular Watermark */}
        <div className="card-watermark-art" aria-hidden="true">
          <img
            src="/card-watermark.jpg"
            alt=""
            className="watermark-img"
          />
        </div>

        {/* Top Row: Clean Brand Logo & Smart Chip */}
        <div className="card-top-row">
          <div className="card-brand-mark">
            <img
              src="/logo.png"
              alt="Sovereign"
              className="logo-dark card-logo"
            />
            <img
              src="/logo-light.png"
              alt="Sovereign"
              className="logo-light card-logo"
            />
          </div>
          <div className="card-emv-chip" title="Sovereign Smart Chip">
            <div className="chip-line horizontal" />
            <div className="chip-line vertical" />
            <div className="chip-core" />
          </div>
        </div>

        {/* Center: Clean Member Typography */}
        <div className="card-body-content">
          <div className="card-member-id">{displayMemberNumber}</div>
          <div className="card-member-name">{name}</div>
          <div className="card-tier-pill">
            <span className="tier-name">{tier}</span>
            {badgeTier && badgeTier !== 'STANDARD' && (
              <>
                <span className="tier-dot">•</span>
                <span className="tier-badge">{badgeTier.replace('_', ' ')}</span>
              </>
            )}
          </div>
        </div>

        {/* Bottom Footer: Minimalist QR Trigger */}
        <div className="card-footer-row">
          <button
            onClick={() => setShowQR(!showQR)}
            className="card-qr-trigger"
            title="Scan / Show Check-in QR"
            aria-label="Toggle QR Code"
          >
            <QrCode size={18} />
          </button>
        </div>
      </div>

      {/* QR Code Inspection Drawer */}
      {showQR && (
        <div
          className="digital-card-qr-drawer"
          style={{
            marginTop: '16px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            textAlign: 'center',
            boxShadow: 'var(--gold-glow)',
          }}
        >
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '12px' }}>
            Official Check-in QR Code
          </div>
          <div
            style={{
              background: '#fff',
              display: 'inline-block',
              padding: '12px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}
          >
            <img src={qrImage} alt="QR Code" style={{ width: 180, height: 180, display: 'block' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-gold)', marginTop: '10px' }}>
            {digitalIdCode}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Present at Sovereign Lodges, Expeditions, and Summit check-in checkpoints.
          </p>
        </div>
      )}
    </div>
  );
};
