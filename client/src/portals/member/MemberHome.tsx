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
  ChevronRight,
  CalendarPlus,
  MessageCircle,
  HeartHandshake,
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
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.65rem', fontWeight: 850, letterSpacing: '0.03em' }}>
            Welcome back, {user?.firstName || 'Brother'}
          </h1>
          <p className="page-subtitle" style={{ fontSize: '0.92rem', color: 'var(--text-gold)', marginTop: '4px', letterSpacing: '0.04em', fontWeight: 700, textTransform: 'uppercase' }}>
            ወንድ መሆን እዳ ነው! • Build the Man. Carry the Responsibility.
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

      {/* 4 Core Metrics Grid (Matching Sovereign Dashboard Design) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '16px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-gold-subtle)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Upcoming events
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
            {upcomingEvents.length || 3}
          </div>
        </div>
        <div className="card" style={{ padding: '16px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-gold-subtle)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Learning progress
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--gold-400)', marginTop: '4px' }}>
            68%
          </div>
        </div>
        <div className="card" style={{ padding: '16px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-gold-subtle)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Sovereign Members
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
            1,250
          </div>
        </div>
        <div className="card" style={{ padding: '16px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-gold-subtle)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Day streak
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>
            12
          </div>
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

      {/* Sovereign Dashboard Core: Upcoming Events & Quick Actions (From Mockup) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Left: Upcoming Events */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>Upcoming events</span>
            <button
              className="btn btn-sm btn-outline-gold"
              onClick={() => onNavigate('member-events')}
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              View all
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid var(--border-color)',
                cursor: 'pointer',
              }}
              onClick={() => onNavigate('member-events')}
            >
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Leadership workshop: Carrying Responsibility</p>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sep 25, 4:00 pm • Addis Ababa Sovereign Hall / Virtual</p>
              </div>
              <ChevronRight size={18} color="var(--gold-400)" />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid var(--border-color)',
                cursor: 'pointer',
              }}
              onClick={() => onNavigate('member-events')}
            >
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Brotherhood Fitness bootcamp & 15km Ruck</p>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sep 28, 8:00 am • Entoto Hills / Regional Gatherings</p>
              </div>
              <ChevronRight size={18} color="var(--gold-400)" />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                cursor: 'pointer',
              }}
              onClick={() => onNavigate('member-events')}
            >
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Money Mastery: Wealth & Syndicate Session</p>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sep 29, 6:00 pm • Executive Room Alpha</p>
              </div>
              <ChevronRight size={18} color="var(--gold-400)" />
            </div>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '16px', fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>
            Quick actions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, justifyContent: 'center' }}>
            <button
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 16px', gap: '12px', fontSize: '0.88rem' }}
              onClick={() => onNavigate('member-events')}
            >
              <CalendarPlus size={18} color="var(--gold-400)" />
              <span>Register for event</span>
            </button>
            <button
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 16px', gap: '12px', fontSize: '0.88rem' }}
              onClick={() => onNavigate('member-mentorship')}
            >
              <MessageCircle size={18} color="var(--gold-400)" />
              <span>Message mentor</span>
            </button>
            <button
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 16px', gap: '12px', fontSize: '0.88rem' }}
              onClick={() => onNavigate('member-card')}
            >
              <Award size={18} color="var(--gold-400)" />
              <span>Show Digital ID Card</span>
            </button>
            <button
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 16px', gap: '12px', fontSize: '0.88rem' }}
              onClick={() => onNavigate('member-service')}
            >
              <HeartHandshake size={18} color="var(--gold-400)" />
              <span>Log Community Service Hours</span>
            </button>
          </div>
        </div>
      </div>

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
