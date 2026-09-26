import React from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { DigitalMemberCard } from '../../components/digital-id/DigitalMemberCard.js';
import { Shield, Award, CheckCircle, Clock, FileCheck } from 'lucide-react';

export const MemberCardView: React.FC = () => {
  const { user } = useAuth();
  const member = user?.member;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Digital Member Credential</h1>
          <p className="page-subtitle">
            Official cryptographically generated identity card for Sovereign Men's Club access and verification.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px' }}>
        {/* Left: Card Display */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <DigitalMemberCard
            memberNumber={member?.memberNumber || 'SOV-001'}
            digitalIdCode={member?.digitalIdCode || 'SOV-ALPHA-001'}
            name={`${user?.firstName} ${user?.lastName}`}
            tier={member?.membershipType?.name || 'Sovereign Brother'}
            badgeTier={member?.badgeTier || 'STANDARD'}
            serviceHours={member?.serviceHoursTotal || 0}
            qrCodeUrl={member?.qrCodeUrl}
          />
        </div>

        {/* Right: Membership Details & Benefits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <h3 className="card-title">
              <Shield size={18} color="var(--gold-400)" />
              Credential Verification Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Member Number</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-gold)', fontWeight: 600 }}>
                  {member?.memberNumber}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Membership Tier</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{member?.membershipType?.name}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Digital ID Hash</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {member?.digitalIdCode}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Induction Date</span>
                <span style={{ color: '#fff' }}>
                  {member?.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'Active Member'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Verified Service Hours</span>
                <span className="badge badge-gold">{member?.serviceHoursTotal || 0} Hours</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">
              <Award size={18} color="var(--gold-400)" />
              Tier Privileges & Access
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '8px', lineHeight: '1.6' }}>
              {member?.membershipType?.benefits ||
                'Full access to all national summits, regional chapters, mentorship tracks, private syndicates, and brotherhood ruck expeditions.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
