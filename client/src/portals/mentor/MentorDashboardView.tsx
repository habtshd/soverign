import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.js';
import { Avatar } from '../../components/common/Avatar.js';
import {
  Users,
  Calendar,
  Plus,
  Compass,
  CheckSquare,
  MessageSquare,
  Award,
  FileText,
  UserCheck,
  Send,
  Download,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const MentorDashboardView: React.FC = () => {
  const { user } = useAuth();
  const [mentorshipData, setMentorshipData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<
    'mentees' | 'matching' | 'sessions' | 'goals' | 'communication' | 'reports'
  >('mentees');

  // Selected mentee
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  // Notes state
  const [newNote, setNewNote] = useState('');
  const [noteIsPrivate, setNoteIsPrivate] = useState(false);

  // New session modal / form
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('18:00');
  const [sessionDuration, setSessionDuration] = useState('60');
  const [sessionAgenda, setSessionAgenda] = useState('');
  const [scheduledSessions, setScheduledSessions] = useState<any[]>([
    {
      id: 'sess-1',
      menteeName: 'Alex Mercer',
      date: '2026-09-28',
      time: '18:00',
      duration: '60 min',
      agenda: 'Q3 Financial Independence & Career Syndicates strategy',
      status: 'SCHEDULED',
    },
    {
      id: 'sess-2',
      menteeName: 'Dawit Tadesse',
      date: '2026-09-22',
      time: '19:00',
      duration: '45 min',
      agenda: 'Leadership accountability and Spartan rucking endurance',
      status: 'COMPLETED',
    },
  ]);
  const [sessionSuccess, setSessionSuccess] = useState(false);

  // Goal setting form
  const [goalTitle, setGoalTitle] = useState('');
  const [goalPillar, setGoalPillar] = useState('CHARACTER');
  const [goalTargetDate, setGoalTargetDate] = useState('');
  const [localGoals, setLocalGoals] = useState<any[]>([
    { id: 'g-1', title: 'Complete 100-Pushup Benchmark under 2 minutes', pillar: 'PHYSICAL', progress: 85, status: 'IN_PROGRESS' },
    { id: 'g-2', title: 'Deploy $5,000 into vetted Real Estate syndicate', pillar: 'WEALTH', progress: 100, status: 'ACHIEVED' },
    { id: 'g-3', title: 'Read Marcus Aurelius Meditations & write reflections', pillar: 'CHARACTER', progress: 70, status: 'IN_PROGRESS' },
  ]);

  // Communication message
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  // Pending Matching queue
  const [pendingMatching, setPendingMatching] = useState<any[]>([
    {
      id: 'match-req-1',
      applicantName: 'Tewodros Kassahun',
      profession: 'Software Engineer',
      focusArea: 'Wealth & Career Acceleration',
      appliedAt: '2 days ago',
      bio: 'Seeking guidance on discipline, business ventures, and physical endurance.',
    },
    {
      id: 'match-req-2',
      applicantName: 'Binyam Assefa',
      profession: 'Civil Architect',
      focusArea: 'Character & Tribe Leadership',
      appliedAt: 'Yesterday',
      bio: 'Committed to becoming a resilient leader for my family and community.',
    },
  ]);

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
      isPrivate: noteIsPrivate,
    });
    setNewNote('');
    loadMentorData();
  };

  const handleScheduleSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionDate || !sessionAgenda.trim()) return;

    const newSess = {
      id: `sess-${Date.now()}`,
      menteeName: currentMatch ? `${currentMatch.mentee?.user?.firstName} ${currentMatch.mentee?.user?.lastName}` : 'Brother',
      date: sessionDate,
      time: sessionTime,
      duration: `${sessionDuration} min`,
      agenda: sessionAgenda,
      status: 'SCHEDULED',
    };

    setScheduledSessions([newSess, ...scheduledSessions]);
    setSessionSuccess(true);
    setTimeout(() => {
      setSessionSuccess(false);
      setSessionAgenda('');
      setSessionDate('');
    }, 2000);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    const newG = {
      id: `g-${Date.now()}`,
      title: goalTitle,
      pillar: goalPillar,
      progress: 10,
      status: 'IN_PROGRESS',
    };

    setLocalGoals([newG, ...localGoals]);
    setGoalTitle('');
  };

  const handleUpdateProgress = (goalId: string, newProg: number) => {
    setLocalGoals(
      localGoals.map((g) =>
        g.id === goalId
          ? { ...g, progress: newProg, status: newProg >= 100 ? 'ACHIEVED' : 'IN_PROGRESS' }
          : g
      )
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setMessageText('');
    }, 2000);
  };

  const handleAcceptMatching = (applicantId: string) => {
    setPendingMatching(pendingMatching.filter((m) => m.id !== applicantId));
    alert('Mentee successfully accepted and added to your active cohort!');
  };

  const matches = mentorshipData?.asMentor?.matches || [];
  const currentMatch = matches.find((m: any) => m.id === selectedMatchId) || matches[0];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Mentor Portal & Command</h1>
          <p className="page-subtitle">
            Responsible for developing brothers: view assigned mentees, manage sessions, set 5-pillar goals, and track progress.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${activeTab === 'mentees' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('mentees')}
          >
            <Users size={14} /> Mentees & Progress
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'matching' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('matching')}
          >
            <UserCheck size={14} /> Matching ({pendingMatching.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'sessions' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('sessions')}
          >
            <Calendar size={14} /> Sessions ({scheduledSessions.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'goals' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('goals')}
          >
            <CheckSquare size={14} /> Goal Tracking
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'communication' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('communication')}
          >
            <MessageSquare size={14} /> Direct Comms
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'reports' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('reports')}
          >
            <FileText size={14} /> Mentorship Reports
          </button>
        </div>
      </div>

      {/* 1. MENTEES & PROGRESS MONITORING */}
      {activeTab === 'mentees' && (
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
                  <Avatar
                    firstName={m.mentee?.user?.firstName}
                    lastName={m.mentee?.user?.lastName}
                    size={44}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      {m.mentee?.user?.firstName} {m.mentee?.user?.lastName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-gold)' }}>
                      {m.mentee?.profile?.profession || 'Member'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Focus: {m.focusArea}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mentee Deep-Dive */}
          {currentMatch ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="card card-gold-border">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <span className="badge badge-gold">ACTIVE DEVELOPMENT COHORT</span>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '4px' }}>
                      Mentee: {currentMatch.mentee?.user?.firstName} {currentMatch.mentee?.user?.lastName}
                    </h2>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Member ID: {currentMatch.mentee?.memberNumber || 'SOV-MEMBER'} • Focus: {currentMatch.focusArea}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Attendance Rate</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981' }}>94%</div>
                  </div>
                </div>

                {/* Progress Overview */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Goals Completed</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-gold)' }}>4 of 5</div>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sessions Held</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>6 Sessions</div>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Service Hours</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>
                      {currentMatch.mentee?.serviceHoursTotal || 32} hrs
                    </div>
                  </div>
                </div>

                {/* Session Notes */}
                <h4 style={{ fontSize: '0.92rem', color: 'var(--text-gold)', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Counsel & Session Notes
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {currentMatch.notes?.map((n: any) => (
                    <div key={n.id} style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '6px' }}>
                      <p style={{ fontSize: '0.88rem', lineHeight: '1.4' }}>{n.note}</p>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Recorded on {new Date(n.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <textarea
                    className="form-input"
                    rows={2}
                    placeholder="Record notes on mentee's character, progress, or assignments..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={noteIsPrivate}
                        onChange={(e) => setNoteIsPrivate(e.target.checked)}
                      />
                      Private Mentor Note (Hidden from mentee)
                    </label>

                    <button type="submit" className="btn btn-primary btn-sm" disabled={!newNote.trim()}>
                      Record Session Note
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No active mentees assigned.
            </div>
          )}
        </div>
      )}

      {/* 2. MENTOR/MENTEE MATCHING */}
      {activeTab === 'matching' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Mentee Intake & Pairing Queue</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Brothers seeking guidance in physical mastery, wealth building, and leadership accountability.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {pendingMatching.map((req) => (
              <div key={req.id} className="card card-gold-border">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge badge-gold">PAIRING REQUEST</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.appliedAt}</span>
                </div>

                <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{req.applicantName}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-gold)', margin: '2px 0 10px' }}>
                  {req.profession} • Focus: {req.focusArea}
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '16px' }}>
                  "{req.bio}"
                </p>

                <button
                  className="btn btn-primary"
                  onClick={() => handleAcceptMatching(req.id)}
                  style={{ width: '100%' }}
                >
                  <UserCheck size={16} /> Accept Brother as Mentee
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MANAGE MENTORSHIP SESSIONS */}
      {activeTab === 'sessions' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 400px) 1fr', gap: '24px' }}>
          {/* Schedule Form */}
          <div className="card card-gold-border">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px' }}>
              Schedule 1-on-1 Mentorship Session
            </h3>

            <form onSubmit={handleScheduleSession}>
              <div className="form-group">
                <label className="form-label">Mentee</label>
                <div style={{ padding: '8px 12px', background: 'var(--bg-primary)', borderRadius: '6px', fontWeight: 600, fontSize: '0.9rem' }}>
                  {currentMatch ? `${currentMatch.mentee?.user?.firstName} ${currentMatch.mentee?.user?.lastName}` : 'Brother'}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Session Date</label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    className="form-input"
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <select
                    className="form-select"
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(e.target.value)}
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Session Agenda & Focus Topics</label>
                <textarea
                  className="form-input"
                  rows={3}
                  required
                  placeholder="e.g. Accountability check on daily workout, career syndicate review..."
                  value={sessionAgenda}
                  onChange={(e) => setSessionAgenda(e.target.value)}
                />
              </div>

              {sessionSuccess && (
                <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', marginBottom: '12px' }}>
                  <CheckCircle size={16} /> Mentorship session booked and calendar invite sent!
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Calendar size={16} /> Schedule & Notify Mentee
              </button>
            </form>
          </div>

          {/* Sessions List */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px' }}>
              Scheduled & Historical Sessions
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {scheduledSessions.map((sess) => (
                <div
                  key={sess.id}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-muted)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{sess.menteeName}</div>
                    <span className={`badge ${sess.status === 'COMPLETED' ? 'badge-success' : 'badge-gold'}`}>
                      {sess.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-gold)', margin: '6px 0 10px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} /> {sess.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> {sess.time} ({sess.duration})
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    Agenda: {sess.agenda}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. SET & TRACK GOALS */}
      {activeTab === 'goals' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 400px) 1fr', gap: '24px' }}>
          {/* Create Goal */}
          <div className="card card-gold-border">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px' }}>
              Set New 5-Pillar Goal
            </h3>

            <form onSubmit={handleAddGoal}>
              <div className="form-group">
                <label className="form-label">Sovereign Pillar</label>
                <select
                  className="form-select"
                  value={goalPillar}
                  onChange={(e) => setGoalPillar(e.target.value)}
                >
                  <option value="CHARACTER">1. Character & Duty</option>
                  <option value="PHYSICAL">2. Physical Prowess & Spartan Fitness</option>
                  <option value="WEALTH">3. Financial Sovereignty & Syndicates</option>
                  <option value="CAREER">4. Career Mastery & Executive Authority</option>
                  <option value="TRIBE">5. Family & Tribe Leadership</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Goal Title & Standard</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. 20km Night Ruck with 20kg pack"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                <Plus size={16} /> Assign Goal to Mentee
              </button>
            </form>
          </div>

          {/* Goal Progress Tracker */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px' }}>
              Mentee Active Goals & Progress Adjuster
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {localGoals.map((g) => (
                <div
                  key={g.id}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-muted)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span className="badge" style={{ fontSize: '0.65rem', marginBottom: '4px' }}>{g.pillar}</span>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{g.title}</div>
                    </div>
                    <span className={`badge ${g.status === 'ACHIEVED' ? 'badge-success' : 'badge-warning'}`}>
                      {g.status}
                    </span>
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                      <span>Progress</span>
                      <span style={{ fontWeight: 700, color: 'var(--text-gold)' }}>{g.progress}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={g.progress}
                      onChange={(e) => handleUpdateProgress(g.id, Number(e.target.value))}
                      style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--gold-500)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. DIRECT COMMUNICATION */}
      {activeTab === 'communication' && (
        <div style={{ maxWidth: '720px' }}>
          <div className="card card-gold-border">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
              Direct Mentee Communication & Accountability Pings
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Send direct guidance, urgent check-ins, or pre-session prep reflections to your mentee.
            </p>

            {/* Quick Templates */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {[
                '🔥 Weekly Accountability Check-In: Have you hit your physical benchmarks?',
                '📖 Pre-Session Reflection: Bring your top 3 decisions of the month to tomorrow’s session.',
                '🛡️ Brotherhood Duty: Remember to log your community service hours for this weekend.',
              ].map((template, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', textAlign: 'left' }}
                  onClick={() => setMessageText(template)}
                >
                  Template {idx + 1}
                </button>
              ))}
            </div>

            <form onSubmit={handleSendMessage}>
              <div className="form-group">
                <label className="form-label">Message Content</label>
                <textarea
                  className="form-input"
                  rows={4}
                  required
                  placeholder="Type your guidance message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
              </div>

              {messageSent && (
                <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', marginBottom: '12px' }}>
                  <CheckCircle size={16} /> Accountability message dispatched to mentee!
                </div>
              )}

              <button type="submit" className="btn btn-primary">
                <Send size={16} /> Send Direct Guidance
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. MENTORSHIP REPORTS */}
      {activeTab === 'reports' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Quarterly Mentorship Evaluation Report</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Official Council performance summary and mentee progression scorecard.
              </p>
            </div>

            <button className="btn btn-primary" onClick={() => alert('Mentorship Performance Scorecard exported!')}>
              <Download size={16} /> Export Scorecard PDF
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Coaching Hours Logged</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-gold)', marginTop: '4px' }}>32.5 Hours</div>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Goal Completion Rate</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>88%</div>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mentees Developed</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#38bdf8', marginTop: '4px' }}>4 Brothers</div>
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Mentee Brother</th>
                <th>Pillar Focus</th>
                <th>Session Count</th>
                <th>Goals Progress</th>
                <th>Accountability Index</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>Alex Mercer</td>
                <td>Wealth & Career</td>
                <td>6 Sessions</td>
                <td>
                  <span className="badge badge-success">85% Complete</span>
                </td>
                <td style={{ color: 'var(--text-gold)', fontWeight: 700 }}>EXEMPLARY (A+)</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Dawit Tadesse</td>
                <td>Spartan Fitness & Discipline</td>
                <td>4 Sessions</td>
                <td>
                  <span className="badge badge-success">90% Complete</span>
                </td>
                <td style={{ color: 'var(--text-gold)', fontWeight: 700 }}>EXEMPLARY (A+)</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
