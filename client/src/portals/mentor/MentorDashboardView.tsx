import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.js';
import { Users, Calendar, Plus, Compass, CheckSquare, MessageSquare } from 'lucide-react';

export const MentorDashboardView: React.FC = () => {
  const { user } = useAuth();
  const [mentorshipData, setMentorshipData] = useState<any | null>(null);
  const [newNote, setNewNote] = useState('');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  useEffect(() => {
    loadMentorData();
  }, []);

  const loadMentorData = async () => {
    const res = await api.mentorship.getMyMentorship();
    if (res.success && res.data) {
      setMentorshipData(res.data);
      if (res.data.asMentor?.matches?.length > 0) {
        setSelectedMatchId(res.data.asMentor.matches[0].id);
      }
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchId || !newNote.trim()) return;
    await api.mentorship.addNote({
      matchId: selectedMatchId,
      note: newNote,
      isPrivate: false,
    });
    setNewNote('');
    loadMentorData();
  };

  const matches = mentorshipData?.asMentor?.matches || [];
  const currentMatch = matches.find((m: any) => m.id === selectedMatchId) || matches[0];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Mentor Command Center</h1>
          <p className="page-subtitle">
            Guide, hold accountable, and sharpen your assigned Sovereign mentees.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '24px' }}>
        {/* Mentees List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Active Mentees ({matches.length})
          </div>

          {matches.map((m: any) => (
            <div
              key={m.id}
              onClick={() => setSelectedMatchId(m.id)}
              className={`card ${currentMatch?.id === m.id ? 'card-gold-border' : ''}`}
              style={{ cursor: 'pointer', padding: '16px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={m.mentee?.user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop'}
                  alt="Mentee"
                  style={{ width: 44, height: 44, borderRadius: '50%', border: '1.5px solid var(--gold-500)', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                    {m.mentee?.user?.firstName} {m.mentee?.user?.lastName}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-gold)' }}>
                    {m.mentee?.profile?.profession || 'Member'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {m.focusArea}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Mentee Detail */}
        {currentMatch ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <span className="badge badge-gold">ACTIVE ENGAGEMENT</span>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                    Mentee: {currentMatch.mentee?.user?.firstName} {currentMatch.mentee?.user?.lastName}
                  </h2>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Pillar: {currentMatch.focusArea}
                  </div>
                </div>
              </div>

              {/* Mentee Goals */}
              <div style={{ marginTop: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-gold)', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Tracked Goals & Standards
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {currentMatch.goals?.map((g: any) => (
                    <div
                      key={g.id}
                      style={{
                        background: 'var(--bg-primary)',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '0.88rem', color: '#fff' }}>• {g.title}</span>
                      <span className={`badge ${g.status === 'ACHIEVED' ? 'badge-success' : 'badge-warning'}`}>
                        {g.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mentor Notes */}
              <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-gold)', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Counsel & Evaluation Notes
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                  {currentMatch.notes?.map((n: any) => (
                    <div key={n.id} style={{ background: 'var(--bg-primary)', padding: '10px 12px', borderRadius: '6px' }}>
                      <p style={{ fontSize: '0.85rem', color: '#fff', lineHeight: '1.4' }}>{n.note}</p>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {new Date(n.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Add an evaluation note or milestone..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary" disabled={!newNote.trim()}>
                    Record Note
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No active mentees assigned.
          </div>
        )}
      </div>
    </div>
  );
};
