import React, { useState } from 'react';
import { Shield, QrCode, RotateCw, Radio, CheckCircle, ExternalLink } from 'lucide-react';
import { formatMemberId } from '../../utils/formatters.js';

export { formatMemberId };

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
  const [isFlipped, setIsFlipped] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const qrImage =
    qrCodeUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
      digitalIdCode || memberNumber
    )}`;

  // Official Sovereign ID format (e.g. MAN 001)
  const displayMemberNumber = formatMemberId(memberNumber);

  // Key security code derived from digital hash or member number
  const securityKey = digitalIdCode
    ? digitalIdCode.replace(/[^A-Z0-9]/gi, '').slice(-4).toUpperCase()
    : '001A';

  const memberYear = joinDate ? new Date(joinDate).getFullYear() : '2024';

  return (
    <div className="digital-id-container">
      {/* 3D Flippable Card Frame */}
      <div
        className="digital-card-flipper"
        onClick={() => setIsFlipped(!isFlipped)}
        title="Click card to flip between Front & Back"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsFlipped(!isFlipped);
          }
        }}
      >
        <div className={`digital-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
          {/* ========================================================
              FRONT FACE: ARTISTIC SOVEREIGN ATLAS & EMV CREDENTIAL
              ======================================================== */}
          <div className="digital-card digital-card-front">
            {/* Minimalist Contour Linework in Empty Space */}
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
              </defs>

              {/* Bottom-left curves */}
              <g stroke="url(#simpleLineGold)" strokeWidth="0.8" fill="none">
                <path d="M -10,215 C 35,212 80,225 140,255" />
                <path d="M -10,228 C 35,225 75,237 120,265" />
                <path d="M -10,241 C 30,238 65,249 95,275" />
              </g>

              {/* Top arches */}
              <g stroke="url(#simpleLineGold)" strokeWidth="0.8" fill="none">
                <path d="M 175,-10 C 215,22 280,22 320,-10" />
                <path d="M 195,-10 C 225,12 270,12 300,-10" />
                <path d="M 215,-10 C 235,5 260,5 280,-10" />
              </g>

              {/* Top-right corner curves */}
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
            </div>

            {/* Bottom Footer: Minimalist Tier Pill & Flip Trigger */}
            <div className="card-footer-row">
              <div className="card-tier-pill">
                <span className="tier-name">{tier}</span>
                {badgeTier && badgeTier !== 'STANDARD' && (
                  <>
                    <span className="tier-dot">•</span>
                    <span className="tier-badge">{badgeTier.replace('_', ' ')}</span>
                  </>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(true);
                  }}
                  className="card-qr-trigger"
                  title="Turn card to view back security features"
                  aria-label="Turn card to view back"
                >
                  <RotateCw size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================
              BACK FACE: LUXURY SECURITY CREDENTIAL & CODE OF CONDUCT
              ======================================================== */}
          <div className="digital-card digital-card-back">
            {/* Subtle Security Linework */}
            <svg
              className="card-guilloche-bg"
              viewBox="0 0 440 260"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="backGoldLine" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--gold-400)" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="var(--gold-400)" stopOpacity="0.02" />
                  <stop offset="100%" stopColor="var(--gold-400)" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <circle cx="220" cy="155" r="75" stroke="url(#backGoldLine)" strokeWidth="0.6" strokeDasharray="3 3" />
              <circle cx="220" cy="155" r="50" stroke="url(#backGoldLine)" strokeWidth="0.6" />
            </svg>

            {/* 1. Full-width Magnetic Security Stripe */}
            <div className="card-back-magstripe">
              <div className="magstripe-nfc">
                <span>NFC TAP ACCESS</span>
                <Radio size={13} />
              </div>
            </div>

            {/* Card Back Content Body */}
            <div className="card-back-body">
              {/* 2. Signature Panel & Scannable QR Code */}
              <div className="card-back-security-row">
                {/* Signature Strip */}
                <div className="card-back-sig-panel">
                  <div className="sig-header">
                    AUTHORIZED SIGNATURE
                  </div>
                  <div className="sig-strip">
                    <div className="sig-name">{name}</div>
                    <div className="sig-cvv-box" title="Security Verification Key">
                      <span className="sig-cvv-label">KEY</span>
                      <span>{securityKey}</span>
                    </div>
                  </div>
                </div>

                {/* Scannable Verification QR Code */}
                <div
                  className="card-back-qr-box"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowQRModal(true);
                  }}
                  title="Click to enlarge verification QR"
                >
                  <div className="qr-wrapper">
                    <img src={qrImage} alt="QR Verification" />
                  </div>
                </div>
              </div>

              {/* 3. The Sovereign Creed: Embossed Gold Foil with Hairline Accents */}
              <div className="card-back-creed">
                <span className="creed-line" />
                <span className="creed-text">DISCIPLINE • RESPONSIBILITY • PURPOSE • SERVICE</span>
                <span className="creed-line" />
              </div>
            </div>

            {/* 4. Lower Security Details & Holographic Seal */}
            <div className="card-back-bottom-row">
              <div className="conclave-meta">
                <div className="conclave-status">
                  <span className="status-dot" />
                  <span>SOVEREIGN CONCLAVE • LIFETIME</span>
                </div>
                <div className="conclave-footer-links">
                  <span style={{ color: 'var(--text-gold)', fontWeight: 700 }}>{displayMemberNumber}</span>
                  <span>•</span>
                  <span>EST. {memberYear}</span>
                </div>
              </div>

              {/* Official Holographic Security Seal */}
              <div className="card-back-hologram" title="Official Sovereign Hologram Seal">
                <div className="hologram-shimmer" />
                <div className="hologram-center">
                  <Shield size={16} className="hologram-icon" />
                  <span className="hologram-label">OFFICIAL SEAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Card Action Bar */}
      <div className="digital-card-actions">
        <button
          type="button"
          className="card-flip-hint-btn"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <RotateCw size={13} />
          {isFlipped ? 'View Card Front' : 'Turn Card Over (View Security Features)'}
        </button>
      </div>

      {/* Enlarged QR Inspection Modal / Drawer */}
      {showQRModal && (
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
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={() => setShowQRModal(false)}
            style={{ marginTop: '10px' }}
          >
            Close QR Preview
          </button>
        </div>
      )}
    </div>
  );
};
