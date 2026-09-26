import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { api } from '../../api/client.js';
import { DigitalMemberCard } from '../../components/digital-id/DigitalMemberCard.js';
import {
  Calendar,
  Award,
  Activity,
  Compass,
  ArrowRight,
  Flame,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface MemberHomeProps {
  onNavigate: (tab: string) => void;
}

export const MemberHome: React.FC<MemberHomeProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [fitnessChallenges, setFitnessChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, [user]);

  const loadHomeData = async () => {
    try {
      const [annRes, evRes, fitRes] = await Promise.all([
        api.community.getAnnouncements(),
        api.events.getAll({ upcomingOnly: true }),
        api.fitness.getChallenges(),
      ]);

      if (annRes.success && annRes.data) setAnnouncements(annRes.data.slice(0, 2));
      if (evRes.success && evRes.data) setUpcomingEvents(evRes.data.slice(0, 2));
      if (fitRes.success && fitRes.data) setFitnessChallenges(fitRes.data.slice(0, 1));
    } finally {
      setLoading(false);
    }
  };

  const member = user?.member;

  return (
    <div>
      {/* Welcome Banner */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Welcome, Brother {user?.firstName}
          </h1>
          <p className="page-subtitle">
            Sovereign Standard: Live with Radical Ownership, Stoic Fortitude, and Unyielding Brotherhood.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-outline-gold" onClick={() => onNavigate('member-card')}>
            Show Digital ID
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate('member-events')}>
            View Expeditions
          </button>
        </div>
      </div>

      {/* Announcements Alert */}
      {announcements.map((ann) => (
        <div
          key={ann.id}
          style={{
            background: 'rgba(201, 151, 56, 0.12)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--gold-glow)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Flame color="#d4af37" size={22} />
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                {ann.title}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', marginTop: '2px' }}>
                {ann.content}
              </div>
            </div>
          </div>
          <span className="badge badge-gold">{ann.priority}</span>
        </div>
      ))}

      {/* Grid: Digital Card & Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Digital ID preview */}
        <div className="card card-gold-border" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
            <span className="card-title" style={{ fontSize: '0.95rem' }}>ACTIVE CREDENTIAL</span>
            <span className="badge badge-success">VERIFIED MEMBER</span>
          </div>

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

        {/* Tactical Status Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div className="card-title">
                <Activity size={18} color="var(--gold-400)" />
                Spartan Fitness Benchmark
              </div>
              <button
                className="btn btn-sm btn-outline-gold"
                onClick={() => onNavigate('member-fitness')}
              >
                Log Pushups
              </button>
            </div>
            {fitnessChallenges.length > 0 ? (
              <div>
                <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>
                  {fitnessChallenges[0].title}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  <span>Completed: {fitnessChallenges[0].myValue} pushups</span>
                  <span>Target: {fitnessChallenges[0].targetValue}</span>
                </div>
                <div
                  style={{
                    height: '8px',
                    background: 'var(--bg-primary)',
                    borderRadius: '4px',
                    marginTop: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      background: 'var(--gold-gradient)',
                      width: `${Math.min(
                        100,
                        (fitnessChallenges[0].myValue / (fitnessChallenges[0].targetValue || 1)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No active challenges</p>
            )}
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div className="card-title">
                <Calendar size={18} color="var(--gold-400)" />
                Next Sovereign Expedition
              </div>
              <button
                className="btn btn-sm btn-outline-gold"
                onClick={() => onNavigate('member-events')}
              >
                All Events
              </button>
            </div>
            {upcomingEvents.length > 0 ? (
              <div>
                <div style={{ fontWeight: 600, color: '#fff' }}>{upcomingEvents[0].title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {new Date(upcomingEvents[0].startTime).toLocaleDateString()} • {upcomingEvents[0].location?.name || 'Sovereign Mountain Lodge'}
                </div>
                <div style={{ marginTop: '10px' }}>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => onNavigate('member-events')}
                  >
                    View Registration Details <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No upcoming events scheduled.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
