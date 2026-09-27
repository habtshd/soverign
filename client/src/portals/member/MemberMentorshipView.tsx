import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { Avatar } from '../../components/common/Avatar.js';
import { Compass, Calendar, CheckSquare, Square, Video, Plus, Shield } from 'lucide-react';

export const MemberMentorshipView: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newSessionDate, setNewSessionDate] = useState('');
  const [newSessionAgenda, setNewSessionAgenda] = useState('');

  useEffect(() => {
    loadMentorship();
  }, []);

  const loadMentorship = async () => {
    try {
      const res = await api.mentorship.getMyMentorship();
      if (res.success && res.data) {
        setData(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleGoal = async (goalId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACHIEVED' ? 'IN_PROGRESS' : 'ACHIEVED';
    await api.mentorship.updateGoal(goalId, nextStatus);
    loadMentorship();
  };

  const handleScheduleSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.asMentee?.[0]?.id) return;
    await api.mentorship.scheduleSession({
      matchId: data.asMentee[0].id,
      scheduledAt: new Date(newSessionDate).toISOString(),
      agenda: newSessionAgenda,
    });
    setShowScheduleModal(false);
    loadMentorship();
  };

  const activeMatch = data?.asMentee?.[0];
  const mentor = activeMatch?.mentor;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Mentorship Track</h1>
          <p className="page-subtitle">
            Direct counsel, character forging, and strategic guidance from senior Sovereign brothers.
          </p>
        </div>

        {activeMatch && (
          <button className="btn btn-primary" onClick={() => setShowScheduleModal(true)}>
            <Plus size={16} /> Request Session
          </button>
        )}
      </div>

      {activeMatch ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: '24px' }}>
          {/* Mentor Profile Card */}
          <div className="card card-gold-border" style={{ alignSelf: 'flex-start' }}>
            <span className="badge badge-gold" style={{ marginBottom: '12px' }}>ASSIGNED MENTOR</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <Avatar
                firstName={mentor?.member?.user?.firstName}
                lastName={mentor?.member?.user?.lastName}
                size={56}
              />
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700 }}>
                  {mentor?.member?.user?.firstName} {mentor?.member?.user?.lastName}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-gold)' }}>
                  {mentor?.member?.profile?.profession || 'Managing Partner'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {mentor?.yearsExperience} Years Experience
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
              {mentor?.bio}
            </p>

            <div style={{ marginTop: '16px', background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Focus Pillar
              </div>
              <div style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600, marginTop: '2px' }}>
                {activeMatch.focusArea}
              </div>
            </div>
          </div>

          {/* Right Column: Sessions & Goals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Scheduled Sessions */}
            <div className="card">
              <h3 className="card-title">
                <Calendar size={18} color="var(--gold-400)" />
                Mentorship Sessions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                {activeMatch.sessions?.map((s: any) => (
                  <div
                    key={s.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--bg-primary)',
                      padding: '14px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>
                        {new Date(s.scheduledAt).toLocaleDateString()} at {new Date(s.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {s.agenda || 'General Review & Accountability'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className={`badge ${s.status === 'COMPLETED' ? 'badge-success' : 'badge-gold'}`}>
                        {s.status}
                      </span>
                      {s.status === 'SCHEDULED' && s.meetingLink && (
                        <a
                          href={s.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-gold"
                        >
                          <Video size={14} /> Join
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Goals */}
            <div className="card">
              <h3 className="card-title">
                <Compass size={18} color="var(--gold-400)" />
                Accountability Goals
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                {activeMatch.goals?.map((g: any) => {
                  const isAchieved = g.status === 'ACHIEVED';
                  return (
                    <div
                      key={g.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--bg-primary)',
                        padding: '12px 14px',
                        borderRadius: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                          onClick={() => handleToggleGoal(g.id, g.status)}
                          style={{ background: 'none', border: 'none', color: isAchieved ? '#10b981' : 'var(--text-muted)', cursor: 'pointer' }}
                        >
                          {isAchieved ? <CheckSquare size={18} /> : <Square size={18} />}
                        </button>
                        <div>
                          <div style={{ fontSize: '0.9rem', color: isAchieved ? 'var(--text-muted)' : '#fff', textDecoration: isAchieved ? 'line-through' : 'none', fontWeight: 600 }}>
                            {g.title}
                          </div>
                          {g.description && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                              {g.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className={`badge ${isAchieved ? 'badge-success' : 'badge-warning'}`}>
                        {g.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Shield size={48} color="var(--gold-400)" style={{ margin: '0 auto 16px auto', display: 'block' }} />
          <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 700 }}>Mentorship Placement in Progress</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '8px auto 20px auto', fontSize: '0.9rem' }}>
            The Sovereign Council is reviewing your intake profile and background to match you with the optimal mentor.
          </p>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700 }}>Schedule Mentorship Session</h3>
              <button onClick={() => setShowScheduleModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleScheduleSession}>
              <div className="form-group">
                <label className="form-label">Session Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  required
                  value={newSessionDate}
                  onChange={(e) => setNewSessionDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Agenda & Topics</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="What key challenges or questions do you want to address?"
                  required
                  value={newSessionAgenda}
                  onChange={(e) => setNewSessionAgenda(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowScheduleModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
