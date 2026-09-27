import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import {
  QrCode,
  CheckCircle,
  Search,
  Users,
  Calendar,
  Layers,
  Award,
  HeartHandshake,
  UserPlus,
  BarChart2,
  Plus,
  Shield,
  Download,
  AlertCircle,
  Clock,
  MapPin,
  TrendingUp,
} from 'lucide-react';

export const OrganizerDashboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'programs' | 'events' | 'scanner' | 'challenges' | 'projects' | 'team' | 'reports'
  >('overview');

  // Events & Scanner state
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [memberCode, setMemberCode] = useState('');
  const [checkInResult, setCheckInResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recentCheckIns, setRecentCheckIns] = useState<any[]>([
    { name: 'Alex Mercer', code: 'SOV-108', time: '10 mins ago', status: 'VERIFIED' },
    { name: 'Dawit Tadesse', code: 'SOV-014', time: '25 mins ago', status: 'VERIFIED' },
  ]);

  // Programs & Activities state
  const [programs, setPrograms] = useState<any[]>([
    {
      id: 'prog-1',
      title: 'Brotherhood Ruck Club',
      lead: 'Dawit Tadesse',
      schedule: 'Every Saturday 06:00 AM',
      location: 'Entoto Mountain Trail',
      participantsCount: 38,
      status: 'ACTIVE',
      description: 'Endurance rucking with 20kg weight pack building physical resilience and grit.',
    },
    {
      id: 'prog-2',
      title: 'Spartan Fitness Bootcamp',
      lead: 'Eyob Haile',
      schedule: 'Mon, Wed, Fri 06:30 AM',
      location: 'Sovereign HQ Gymnasium',
      participantsCount: 52,
      status: 'ACTIVE',
      description: 'High-intensity functional calisthenics, kettlebell circuits, and pushup benchmarks.',
    },
    {
      id: 'prog-3',
      title: 'Financial Mastery & Syndicates Circle',
      lead: 'Habtemariam Delelew',
      schedule: 'Bi-weekly Thursdays 19:00',
      location: 'Executive Council Room & Virtual',
      participantsCount: 29,
      status: 'ACTIVE',
      description: 'Capital deployment strategies, commercial real estate syndication, and private equity deals.',
    },
  ]);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [progTitle, setProgTitle] = useState('');
  const [progLead, setProgLead] = useState('');
  const [progSchedule, setProgSchedule] = useState('');
  const [progLocation, setProgLocation] = useState('');
  const [progDesc, setProgDesc] = useState('');

  // Challenges state
  const [challenges, setChallenges] = useState<any[]>([
    {
      id: 'ch-1',
      title: '30-Day Spartan Discipline Sprint',
      target: '30 Days 05:00 AM wake up + cold shower + 100 pushups',
      participants: 45,
      completedCount: 28,
      status: 'IN_PROGRESS',
    },
    {
      id: 'ch-2',
      title: '100-Pushup Benchmark Under 2 Minutes',
      target: '100 uninterrupted full-range pushups',
      participants: 62,
      completedCount: 39,
      status: 'ACTIVE',
    },
    {
      id: 'ch-3',
      title: 'Entoto 25km Night Ruck Challenge',
      target: '25km endurance march with 20kg ruck pack',
      participants: 34,
      completedCount: 24,
      status: 'UPCOMING',
    },
  ]);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [chTitle, setChTitle] = useState('');
  const [chTarget, setChTarget] = useState('');

  // Community Projects state
  const [projects, setProjects] = useState<any[]>([
    {
      id: 'proj-1',
      title: 'Addis Ababa Youth Technology Center Refurbishment',
      lead: 'Dawit Tadesse',
      volunteersCount: 24,
      targetHours: 120,
      loggedHours: 85,
      status: 'IN_PROGRESS',
      description: 'Renovating computer labs and mentoring 50 young high-school boys in technology and discipline.',
    },
    {
      id: 'proj-2',
      title: 'Entoto Forest Ecosystem Tree Planting Expedition',
      lead: 'Alex Mercer',
      volunteersCount: 40,
      targetHours: 80,
      loggedHours: 80,
      status: 'COMPLETED',
      description: 'Planted 2,500 indigenous trees with fellow brothers as civic stewardship.',
    },
  ]);

  // Responsibility Assignments state
  const [teamAssignments, setTeamAssignments] = useState<any[]>([
    { member: 'Dawit Tadesse', role: 'Head of Expeditions & Physical Culture', responsibilities: 'Ruck marches, fitness bootcamps, safety protocols' },
    { member: 'Alex Mercer', role: 'Community Impact Coordinator', responsibilities: 'Civic service logistics, volunteer roster, hours verification' },
    { member: 'Yonas Kassa', role: 'Mentorship Dean', responsibilities: '1-on-1 mentor pairings, quarterly scorecards, accountability reviews' },
    { member: 'Henok Solomon', role: 'Treasury & Logistics Officer', responsibilities: 'Event equipment procurement, venue booking, catering ledger' },
  ]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const res = await api.events.getAll();
    if (res.success && res.data) {
      setEvents(res.data);
      if (res.data.length > 0) setSelectedEventId(res.data[0].id);
    }
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId || !memberCode.trim()) return;

    setErrorMsg(null);
    setCheckInResult(null);

    const res = await api.events.checkIn(selectedEventId, memberCode.trim());
    if (res.success && res.data) {
      setCheckInResult(res.data);
      setRecentCheckIns([
        {
          name: `${res.data.member?.user?.firstName || 'Brother'} ${res.data.member?.user?.lastName || ''}`,
          code: res.data.member?.memberNumber || memberCode,
          time: 'Just now',
          status: 'VERIFIED',
        },
        ...recentCheckIns,
      ]);
      setMemberCode('');
      loadEvents();
    } else {
      setErrorMsg(res.error || 'Failed to check in member. Please check ID code or status.');
    }
  };

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progTitle.trim()) return;

    const newProg = {
      id: `prog-${Date.now()}`,
      title: progTitle,
      lead: progLead || 'Leader Dawit',
      schedule: progSchedule || 'Weekly',
      location: progLocation || 'Addis Ababa',
      participantsCount: 1,
      status: 'ACTIVE',
      description: progDesc,
    };

    setPrograms([newProg, ...programs]);
    setShowProgramModal(false);
    setProgTitle('');
    setProgLead('');
    setProgSchedule('');
    setProgLocation('');
    setProgDesc('');
  };

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chTitle.trim()) return;

    const newCh = {
      id: `ch-${Date.now()}`,
      title: chTitle,
      target: chTarget,
      participants: 12,
      completedCount: 0,
      status: 'ACTIVE',
    };

    setChallenges([newCh, ...challenges]);
    setShowChallengeModal(false);
    setChTitle('');
    setChTarget('');
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Leader & Organizer Command Portal</h1>
          <p className="page-subtitle">
            Oversee programs & activities, manage event attendance, coordinate discipline challenges, and lead community service.
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart2 size={14} /> Leader Command
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'programs' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('programs')}
          >
            <Layers size={14} /> Programs ({programs.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'scanner' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('scanner')}
          >
            <QrCode size={14} /> QR Check-in Terminal
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'challenges' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('challenges')}
          >
            <Award size={14} /> Challenges ({challenges.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'projects' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('projects')}
          >
            <HeartHandshake size={14} /> Service Projects ({projects.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'team' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('team')}
          >
            <UserPlus size={14} /> Responsibilities
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'reports' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('reports')}
          >
            <TrendingUp size={14} /> Operational Reports
          </button>
        </div>
      </div>

      {/* 1. OVERVIEW & KPIS */}
      {activeTab === 'overview' && (
        <div>
          <div className="metrics-grid">
            <div className="stat-card">
              <div>
                <div className="stat-label">Active Club Programs</div>
                <div className="stat-value" style={{ color: 'var(--text-gold)' }}>
                  {programs.length} Cohorts
                </div>
                <div style={{ fontSize: '0.75rem', color: '#10b981' }}>119 Active Brothers Enrolled</div>
              </div>
              <div className="stat-icon-wrapper">
                <Layers size={22} />
              </div>
            </div>

            <div className="stat-card">
              <div>
                <div className="stat-label">Event Attendance Velocity</div>
                <div className="stat-value">94.2%</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Average Summit Turnout</div>
              </div>
              <div className="stat-icon-wrapper">
                <Calendar size={22} />
              </div>
            </div>

            <div className="stat-card">
              <div>
                <div className="stat-label">Discipline Benchmarks</div>
                <div className="stat-value" style={{ color: '#38bdf8' }}>
                  {challenges.length} Active
                </div>
                <div style={{ fontSize: '0.75rem', color: '#10b981' }}>91 Completions Verified</div>
              </div>
              <div className="stat-icon-wrapper">
                <Award size={22} />
              </div>
            </div>

            <div className="stat-card">
              <div>
                <div className="stat-label">Civic Service Projects</div>
                <div className="stat-value" style={{ color: '#10b981' }}>
                  {projects.length} Initiatives
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>165 Total Volunteer Hours</div>
              </div>
              <div className="stat-icon-wrapper">
                <HeartHandshake size={22} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginTop: '24px' }}>
            {/* Quick Actions */}
            <div className="card card-gold-border">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px' }}>
                Operational Launchpad
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Instant actions to trigger activities, open attendance gates, or review brother discipline.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button className="btn btn-primary" onClick={() => setActiveTab('scanner')}>
                  <QrCode size={16} /> Open Event QR Check-In Terminal
                </button>
                <button className="btn btn-secondary" onClick={() => { setActiveTab('programs'); setShowProgramModal(true); }}>
                  <Plus size={16} /> Create New Club Program / Activity
                </button>
                <button className="btn btn-secondary" onClick={() => { setActiveTab('challenges'); setShowChallengeModal(true); }}>
                  <Award size={16} /> Launch Physical / Spartan Challenge
                </button>
                <button className="btn btn-secondary" onClick={() => setActiveTab('team')}>
                  <UserPlus size={16} /> Assign Leadership Responsibilities
                </button>
              </div>
            </div>

            {/* Leadership & Accountability Creed */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <Shield size={20} color="var(--gold-400)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Leader Accountability Standard</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                "The leader does not merely supervise; the leader arrives first and departs last. He carries the pack, enforces the standard, and builds other men into sovereigns."
              </p>
              <div style={{ marginTop: '16px', padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-gold)', fontWeight: 600 }}>Active Council Lead</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '2px' }}>Dawit Tadesse (Head of Expeditions)</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status: Active In-Field Duty</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PROGRAMS & ACTIVITIES MANAGEMENT */}
      {activeTab === 'programs' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Club Programs & Activities</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Coordinate structured development cohorts: rucking, strength culture, and capital mastery.
              </p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowProgramModal(true)}>
              <Plus size={14} /> Launch Program
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {programs.map((prog) => (
              <div key={prog.id} className="card card-gold-border">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge badge-gold">{prog.status}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{prog.participantsCount} Brothers</span>
                </div>

                <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{prog.title}</h4>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-gold)', margin: '4px 0 10px' }}>
                  Lead: {prog.lead}
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '14px' }}>
                  {prog.description}
                </p>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-muted)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={13} /> {prog.schedule}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={13} /> {prog.location}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Program Modal */}
          {showProgramModal && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '480px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>
                  Launch New Club Program
                </h3>

                <form onSubmit={handleCreateProgram}>
                  <div className="form-group">
                    <label className="form-label">Program Title</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Sovereign Mountain Ruck Series"
                      value={progTitle}
                      onChange={(e) => setProgTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Lead Organizer / Brother</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Dawit Tadesse"
                      value={progLead}
                      onChange={(e) => setProgLead(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group">
                      <label className="form-label">Schedule</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Every Saturday 6 AM"
                        value={progSchedule}
                        onChange={(e) => setProgSchedule(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location / Trail</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Entoto Trails"
                        value={progLocation}
                        onChange={(e) => setProgLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Program Mission & Curriculum</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder="Objectives and physical/intellectual standards required..."
                      value={progDesc}
                      onChange={(e) => setProgDesc(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                      Publish & Enlist Brothers
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowProgramModal(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. EVENT QR ATTENDANCE SCANNER */}
      {activeTab === 'scanner' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '24px' }}>
          {/* Scanner / Check-in Form */}
          <div className="card card-gold-border">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <QrCode size={22} color="var(--gold-400)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                Physical Check-In Terminal
              </h3>
            </div>

            <form onSubmit={handleCheckIn}>
              <div className="form-group">
                <label className="form-label">Select Active Event</label>
                <select
                  className="form-select"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                >
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title} ({new Date(e.startTime).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Scan QR Code or Input Member ID</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Scan or enter code (e.g. SOV-001 or SOV-108)"
                  required
                  value={memberCode}
                  onChange={(e) => setMemberCode(e.target.value)}
                />
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Accepts QR hash, Digital ID string, or Member Number.
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                Verify & Check In Brother
              </button>
            </form>

            {/* Check-in result alert */}
            {checkInResult && (
              <div
                style={{
                  marginTop: '20px',
                  padding: '16px',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10b981',
                  color: '#10b981',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1rem' }}>
                  <CheckCircle size={20} /> CLEARANCE GRANTED
                </div>
                <div style={{ marginTop: '8px', fontSize: '0.88rem', color: '#fff' }}>
                  Brother: <strong>{checkInResult.member?.user?.firstName} {checkInResult.member?.user?.lastName}</strong>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-gold)', marginTop: '2px' }}>
                  ID: {checkInResult.member?.memberNumber} • Tier: {checkInResult.member?.membershipType?.name || 'Sovereign Brother'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Method: {checkInResult.method || 'QR_SCAN'} • Logged at {new Date(checkInResult.checkedInAt).toLocaleTimeString()}
                </div>
              </div>
            )}

            {errorMsg && (
              <div
                style={{
                  marginTop: '20px',
                  padding: '14px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #ef4444',
                  color: '#f87171',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.88rem',
                }}
              >
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Live Attendance Roster */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                  Live Verified Attendance Roster
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Event: {selectedEvent?.title || 'Selected Gathering'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentCheckIns.map((ci, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'var(--bg-primary)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gold-500-10)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-gold)', fontWeight: 700, fontSize: '0.85rem' }}>
                      {ci.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{ci.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-gold)' }}>{ci.code}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>{ci.status}</span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{ci.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. MANAGE CHALLENGES */}
      {activeTab === 'challenges' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Discipline & Physical Challenges</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Set rigorous benchmarks that forge brothers in discipline, stamina, and mental toughness.
              </p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowChallengeModal(true)}>
              <Plus size={14} /> New Challenge
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
            {challenges.map((ch) => (
              <div key={ch.id} className="card card-gold-border">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge badge-gold">{ch.status}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{ch.participants} Enlisted</span>
                </div>

                <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{ch.title}</h4>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-gold)', margin: '4px 0 12px' }}>
                  Benchmark: {ch.target}
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span>Verified Completions</span>
                    <span style={{ fontWeight: 700 }}>{ch.completedCount} / {ch.participants}</span>
                  </div>
                  <div className="progress-bar-bg" style={{ height: '8px' }}>
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${Math.round((ch.completedCount / ch.participants) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => alert(`Verification log for ${ch.title} opened.`)}
                >
                  <CheckCircle size={14} /> Verify Brother Completions
                </button>
              </div>
            ))}
          </div>

          {/* Challenge Modal */}
          {showChallengeModal && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '440px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
                  Create Discipline Benchmark
                </h3>

                <form onSubmit={handleCreateChallenge}>
                  <div className="form-group">
                    <label className="form-label">Challenge Title</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. 100-Pushup Benchmark"
                      value={chTitle}
                      onChange={(e) => setChTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Target Standard</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. 100 pushups under 2 minutes"
                      value={chTarget}
                      onChange={(e) => setChTarget(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                      Publish Challenge
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowChallengeModal(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. COMMUNITY PROJECTS & SERVICE COORDINATION */}
      {activeTab === 'projects' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Civic Service Projects Coordination</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Organize brotherhood volunteer initiatives and approve logged service hours.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {projects.map((proj) => (
              <div key={proj.id} className="card card-gold-border">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className={`badge ${proj.status === 'COMPLETED' ? 'badge-success' : 'badge-gold'}`}>
                    {proj.status}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{proj.volunteersCount} Volunteers</span>
                </div>

                <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{proj.title}</h4>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-gold)', margin: '4px 0 10px' }}>
                  Project Lead: {proj.lead}
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '14px' }}>
                  {proj.description}
                </p>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span>Service Hours Contributed</span>
                    <span style={{ fontWeight: 700 }}>{proj.loggedHours} / {proj.targetHours} hrs</span>
                  </div>
                  <div className="progress-bar-bg" style={{ height: '8px' }}>
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${Math.min(100, Math.round((proj.loggedHours / proj.targetHours) * 100))}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => alert(`Service hours roster for ${proj.title} loaded.`)}
                >
                  <HeartHandshake size={14} /> Review & Approve Volunteer Hours
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. ASSIGN RESPONSIBILITIES */}
      {activeTab === 'team' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Leadership & Responsibility Assignments</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Delegate operational commands to trusted brothers: Expedition leads, service directors, and logisticians.
              </p>
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Assigned Brother</th>
                <th>Leadership Command Role</th>
                <th>Core Responsibilities</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {teamAssignments.map((t, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700 }}>{t.member}</td>
                  <td>
                    <span className="badge badge-gold">{t.role}</span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t.responsibilities}</td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => alert(`Updated responsibilities for ${t.member}`)}
                    >
                      Edit Mandate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 7. OPERATIONAL REPORTS */}
      {activeTab === 'reports' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Operational Turnout & Participation Reports</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Data intelligence for club organizers: attendance consistency, challenge completions, and volunteer impact.
              </p>
            </div>

            <button className="btn btn-primary" onClick={() => alert('Operational Report CSV exported!')}>
              <Download size={16} /> Export Operations CSV
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Brother</th>
                <th>Member ID</th>
                <th>Summit Attendance Rate</th>
                <th>Challenges Finished</th>
                <th>Service Hours</th>
                <th>Accountability Standing</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 700 }}>Dawit Tadesse</td>
                <td style={{ color: 'var(--text-gold)' }}>SOV-014</td>
                <td>100% (8/8 Summits)</td>
                <td>3 of 3 Benchmarks</td>
                <td>48 Hours</td>
                <td>
                  <span className="badge badge-gold">COUNCIL LEADER</span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>Alex Mercer</td>
                <td style={{ color: 'var(--text-gold)' }}>SOV-108</td>
                <td>92% (11/12 Summits)</td>
                <td>2 of 3 Benchmarks</td>
                <td>32 Hours</td>
                <td>
                  <span className="badge badge-success">ACTIVE BROTHER</span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>Yonas Kassa</td>
                <td style={{ color: 'var(--text-gold)' }}>SOV-007</td>
                <td>100% (12/12 Summits)</td>
                <td>3 of 3 Benchmarks</td>
                <td>65 Hours</td>
                <td>
                  <span className="badge badge-gold">FOUNDING MENTOR</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
