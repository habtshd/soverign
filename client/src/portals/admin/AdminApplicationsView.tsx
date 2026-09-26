import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { FileText, Check, X, Shield, Eye } from 'lucide-react';

export const AdminApplicationsView: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApps();
  }, [statusFilter]);

  const loadApps = async () => {
    const res = await api.members.getApplications({ status: statusFilter || undefined });
    if (res.success && res.data) {
      setApplications(res.data);
    }
    setLoading(false);
  };

  const handleReview = async (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedApp) return;
    await api.members.reviewApplication(selectedApp.id, status, reviewNotes || `Processed as ${status}`);
    setSelectedApp(null);
    setReviewNotes('');
    loadApps();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Member Applications & Intake Pipeline</h1>
          <p className="page-subtitle">
            Review incoming aspirants from Google Forms, Google Sheets sync, and direct portal intake.
          </p>
        </div>

        <select
          className="form-select"
          style={{ width: '180px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Applications</option>
          <option value="SUBMITTED">Pending Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Declined</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Applicant Name</th>
              <th>Email / Contact</th>
              <th>Profession / Company</th>
              <th>City</th>
              <th>Source</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td style={{ fontWeight: 600, color: '#fff' }}>{app.fullName}</td>
                <td>
                  <div>{app.email}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.phone || 'No phone'}</div>
                </td>
                <td>
                  <div>{app.occupation || 'Not stated'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.company}</div>
                </td>
                <td>{app.city || 'United States'}</td>
                <td>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: '#fff' }}>
                    {app.source}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      app.status === 'APPROVED'
                        ? 'badge-success'
                        : app.status === 'REJECTED'
                        ? 'badge-danger'
                        : 'badge-warning'
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-gold"
                    onClick={() => {
                      setSelectedApp(app);
                      setReviewNotes(app.reviewNotes || '');
                    }}
                  >
                    <Eye size={13} /> Inspect & Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {selectedApp && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 700 }}>
                Intake Review: {selectedApp.fullName}
              </h3>
              <button onClick={() => setSelectedApp(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Professional Background</div>
                <div style={{ color: '#fff', fontWeight: 600 }}>{selectedApp.occupation} at {selectedApp.company || 'Private'} ({selectedApp.city})</div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reason To Seek Sovereign Brotherhood</div>
                <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '6px', color: 'var(--text-gold)', fontStyle: 'italic', marginTop: '4px', lineHeight: '1.5' }}>
                  "{selectedApp.reasonToJoin}"
                </div>
              </div>

              {selectedApp.googleFormResponseId && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Google Form Ingestion ID: <code style={{ color: 'var(--text-gold)' }}>{selectedApp.googleFormResponseId}</code>
                </div>
              )}

              <div className="form-group" style={{ marginTop: '10px' }}>
                <label className="form-label">Council Review Notes & Determination</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Record council findings or induction remarks..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
              <button
                className="btn btn-secondary"
                style={{ color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}
                onClick={() => handleReview('REJECTED')}
              >
                <X size={14} /> Decline Application
              </button>

              <button
                className="btn btn-primary"
                onClick={() => handleReview('APPROVED')}
              >
                <Check size={14} /> Approve & Grant Sovereign Standing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
