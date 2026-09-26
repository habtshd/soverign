import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { Activity, Dumbbell, Flame, Trophy, Plus, Check } from 'lucide-react';

export const MemberFitnessView: React.FC = () => {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [history, setHistory] = useState<any | null>(null);
  const [addedPushups, setAddedPushups] = useState('');
  const [logSuccess, setLogSuccess] = useState(false);

  // Modal for logging workout
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [workoutDuration, setWorkoutDuration] = useState('45');
  const [workoutNotes, setWorkoutNotes] = useState('');

  // Modal for logging stats
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [weight, setWeight] = useState('');
  const [pullups, setPullups] = useState('');

  useEffect(() => {
    loadFitnessData();
  }, []);

  const loadFitnessData = async () => {
    const [cRes, pRes, hRes] = await Promise.all([
      api.fitness.getChallenges(),
      api.fitness.getPrograms(),
      api.fitness.getHistory(),
    ]);

    if (cRes.success && cRes.data) setChallenges(cRes.data);
    if (pRes.success && pRes.data) setPrograms(pRes.data);
    if (hRes.success && hRes.data) setHistory(hRes.data);
  };

  const handleAddPushups = async (challengeId: string) => {
    if (!addedPushups || isNaN(Number(addedPushups))) return;
    const res = await api.fitness.logChallengeProgress(challengeId, Number(addedPushups));
    if (res.success) {
      setAddedPushups('');
      setLogSuccess(true);
      setTimeout(() => setLogSuccess(false), 3000);
      loadFitnessData();
    }
  };

  const handleSaveWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.fitness.logWorkout({
      durationMinutes: Number(workoutDuration),
      notes: workoutNotes,
    });
    setShowWorkoutModal(false);
    setWorkoutNotes('');
    loadFitnessData();
  };

  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.fitness.logProgress({
      weight: weight ? Number(weight) : undefined,
      pullupsCount: pullups ? Number(pullups) : undefined,
    });
    setShowStatsModal(false);
    loadFitnessData();
  };

  const mainChallenge = challenges[0];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Fitness & Spartan Protocol</h1>
          <p className="page-subtitle">
            Physical vitality is non-negotiable. Forge an unshakeable, combat-ready physique.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-outline-gold" onClick={() => setShowStatsModal(true)}>
            Record Biometrics
          </button>
          <button className="btn btn-primary" onClick={() => setShowWorkoutModal(true)}>
            <Plus size={16} /> Log Session
          </button>
        </div>
      </div>

      {/* Main Challenge Banner */}
      {mainChallenge && (
        <div className="card card-gold-border" style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trophy color="#d4af37" size={24} />
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                  {mainChallenge.title}
                </h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '6px' }}>
                {mainChallenge.description}
              </p>
            </div>

            {/* Quick Log Form */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="number"
                className="form-input"
                placeholder="Reps done today (e.g. 100)"
                style={{ width: '220px', height: '40px' }}
                value={addedPushups}
                onChange={(e) => setAddedPushups(e.target.value)}
              />
              <button
                className="btn btn-primary"
                style={{ height: '40px' }}
                onClick={() => handleAddPushups(mainChallenge.id)}
              >
                Log Reps
              </button>
            </div>
          </div>

          {logSuccess && (
            <div style={{ color: '#10b981', fontSize: '0.82rem', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={16} /> Reps recorded into Sovereign Brotherhood Ledger!
            </div>
          )}

          {/* Progress Bar */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <span>
                Personal Total: <strong style={{ color: '#fff' }}>{mainChallenge.myValue}</strong> / {mainChallenge.targetValue} pushups
              </span>
              <span>
                {Math.round((mainChallenge.myValue / (mainChallenge.targetValue || 1)) * 100)}% Complete
              </span>
            </div>
            <div style={{ height: '12px', background: 'var(--bg-primary)', borderRadius: '6px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: 'var(--gold-gradient)',
                  width: `${Math.min(100, (mainChallenge.myValue / (mainChallenge.targetValue || 1)) * 100)}%`,
                  boxShadow: 'var(--gold-glow)',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Grid: Programs & Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Programs */}
        <div className="card">
          <h3 className="card-title">
            <Dumbbell size={18} color="var(--gold-400)" />
            Active Tactical Conditioning Protocols
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            {programs.map((p) => (
              <div key={p.id} style={{ background: 'var(--bg-primary)', borderRadius: '8px', padding: '16px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-gold">{p.difficulty}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.durationWeeks} Weeks</span>
                </div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.05rem', margin: '8px 0 4px 0' }}>
                  {p.title}
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {p.description}
                </p>

                <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>SCHEDULE:</div>
                  {p.workoutPlans?.map((plan: any) => (
                    <div key={plan.id} style={{ fontSize: '0.8rem', color: 'var(--text-main)', padding: '3px 0' }}>
                      • {plan.title}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* History / Recent Sessions */}
        <div className="card">
          <h3 className="card-title">
            <Activity size={18} color="var(--gold-400)" />
            Recent Logged Sessions
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
            {history?.workouts?.length > 0 ? (
              history.workouts.map((w: any) => (
                <div
                  key={w.id}
                  style={{
                    background: 'var(--bg-primary)',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>
                      {w.notes || 'Tactical Conditioning Routine'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(w.date).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="badge badge-gold">{w.durationMinutes} min</span>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No logged sessions yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Log Workout Modal */}
      {showWorkoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700 }}>Log Workout Session</h3>
              <button onClick={() => setShowWorkoutModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSaveWorkout}>
              <div className="form-group">
                <label className="form-label">Duration (Minutes)</label>
                <input
                  type="number"
                  className="form-input"
                  required
                  value={workoutDuration}
                  onChange={(e) => setWorkoutDuration(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Session Notes / Exercises Completed</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="e.g. 5-mile weighted ruck with 35lb pack + 150 pullups"
                  required
                  value={workoutNotes}
                  onChange={(e) => setWorkoutNotes(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowWorkoutModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Session</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Stats Modal */}
      {showStatsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700 }}>Record Biometrics</h3>
              <button onClick={() => setShowStatsModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSaveStats}>
              <div className="form-group">
                <label className="form-label">Bodyweight (lbs)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  placeholder="185.0"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Max Strict Pullups</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="18"
                  value={pullups}
                  onChange={(e) => setPullups(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowStatsModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Biometrics</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
