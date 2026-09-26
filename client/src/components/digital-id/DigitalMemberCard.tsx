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

  return (
    <div className="digital-id-container">
      <div className="digital-card">
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} color="#d4af37" />
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '0.85rem',
                  letterSpacing: '0.12em',
                  color: '#fff',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                Sovereign Men's Club
              </span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-gold)', letterSpacing: '0.1em', marginTop: '2px' }}>
              OPERATIONAL CREDENTIAL
            </div>
          </div>
          <div className="digital-card-chip" />
        </div>

        {/* Center: Member Number & Name */}
        <div>
          <div className="digital-card-number">{memberNumber || 'SOV-000'}</div>
          <div
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#fff',
              marginTop: '4px',
              letterSpacing: '0.04em',
            }}
          >
            {name}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <span className="badge badge-gold">{tier}</span>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}>
              <Award size={12} style={{ marginRight: '3px' }} />
              {badgeTier.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Bottom Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '10px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Verified Status
            </div>
            <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
              ACTIVE & STANDING
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
              <Clock size={10} /> Service Hours
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-gold)', fontWeight: 700 }}>
              {serviceHours} hrs
            </div>
          </div>

          <button
            onClick={() => setShowQR(!showQR)}
            style={{
              background: 'rgba(201, 151, 56, 0.15)',
              border: '1px solid var(--border-gold)',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              color: 'var(--gold-400)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Scan / Show Check-in QR"
          >
            <QrCode size={20} />
          </button>
        </div>
      </div>

      {/* QR Code Inspection Drawer */}
      {showQR && (
        <div
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
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>
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
