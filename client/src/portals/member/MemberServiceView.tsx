import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { HeartHandshake, Clock, Users, Plus, Check } from 'lucide-react';

export const MemberServiceView: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [hours, setHours] = useState('');
  const [notes, setNotes] = useState('');
  const [logSuccess, setLogSuccess] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const res = await api.service.getProjects();
    if (res.success && res.data) {
      setProjects(res.data);
    }
  };

  const handleVolunteer = async (projectId: string) => {
    await api.service.volunteer(projectId);
    loadProjects();
  };

  const handleLogHours = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !hours) return;
    const res = await api.service.logHours(selectedProjectId, Number(hours), notes);
    if (res.success) {
      setLogSuccess(true);
      setTimeout(() => {
        setLogSuccess(false);
        setSelectedProjectId(null);
        setHours('');
        setNotes('');
      }, 2000);
      loadProjects();
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Community Service & Brotherhood Impact</h1>
          <p className="page-subtitle">
            True leaders serve. Mobilize for regional community restoration, youth mentoring, and direct action.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {projects.map((proj) => (
          <div key={proj.id} className="card card-gold-border" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="badge badge-gold">{proj.status}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {new Date(proj.startDate).toLocaleDateString()}
              </span>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: '12px 0 6px 0' }}>
              {proj.title}
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', flex: 1, marginBottom: '16px', lineHeight: '1.5' }}>
              {proj.description}
            </p>

            <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>LOCATION & TARGET:</div>
              <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>{proj.location}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-gold)', marginTop: '2px' }}>
                Goal: {proj.targetVolunteers} Brothers • {proj.targetHours} Total Hours
              </div>
            </div>

            {/* Impact Metrics */}
            {proj.impactRecords?.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', marginBottom: '14px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Impact Delivered</div>
                {proj.impactRecords.map((imp: any) => (
                  <div key={imp.id} style={{ fontSize: '0.82rem', color: '#34d399', display: 'flex', justifyContent: 'space-between' }}>
                    <span>• {imp.metricName}</span>
                    <strong>{imp.metricValue}</strong>
                  </div>
                ))}
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              {proj.isVolunteering ? (
                <button
                  className="btn btn-sm btn-outline-gold"
                  onClick={() => setSelectedProjectId(proj.id)}
                >
                  <Clock size={14} /> Log Service Hours
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleVolunteer(proj.id)}
                >
                  <HeartHandshake size={14} /> Volunteer Mobilization
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Log Hours Modal */}
      {selectedProjectId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700 }}>Log Community Service Hours</h3>
              <button onClick={() => setSelectedProjectId(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
            </div>
            {logSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#10b981' }}>
                <Check size={36} style={{ margin: '0 auto 8px auto', display: 'block' }} />
                <h3>Hours Logged & Credential Updated!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Your verified service total on your digital ID card has increased.</p>
              </div>
            ) : (
              <form onSubmit={handleLogHours}>
                <div className="form-group">
                  <label className="form-label">Hours Served</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-input"
                    placeholder="4.0"
                    required
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Service Summary & Contribution</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Describe tasks completed, e.g. roofing construction and safety prep"
                    required
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedProjectId(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Record Hours</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
