import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import {
  Users,
  DollarSign,
  Calendar,
  FileText,
  Shield,
  Activity,
  Check,
  X,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface AdminDashboardViewProps {
  onNavigate: (tab: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigate }) => {
  const [metrics, setMetrics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.admin.getDashboard();
      if (res.success && res.data) {
        setMetrics(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickApprove = async (id: string) => {
    await api.members.reviewApplication(id, 'APPROVED', 'Quick approved from executive dashboard');
    loadDashboard();
  };

  const handleQuickReject = async (id: string) => {
    await api.members.reviewApplication(id, 'REJECTED', 'Reviewed and declined');
    loadDashboard();
  };

  if (!metrics) {
    return <div style={{ color: 'var(--text-muted)', padding: '40px', textAlign: 'center' }}>Loading executive metrics...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Command Dashboard</h1>
          <p className="page-subtitle">
            Real-time operational telemetry across membership, treasury, expeditions, and community impact.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-outline-gold" onClick={() => onNavigate('admin-integrations')}>
            Sync Google Ecosystem
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate('admin-applications')}>
            Review Applications ({metrics.membership?.pendingApplications || 0})
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="stat-card">
          <div>
            <div className="stat-label">Active Sovereign Brothers</div>
            <div className="stat-value">{metrics.membership?.activeMembers || 0}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {metrics.membership?.totalMembers} total registered
            </div>
          </div>
          <div className="stat-icon-wrapper">
            <Users size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Treasury Net Balance</div>
            <div className="stat-value" style={{ color: 'var(--text-gold)' }}>
              ${metrics.finance?.netTreasury?.toLocaleString() || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981' }}>
              +${metrics.finance?.totalRevenue?.toLocaleString()} Gross Inflow
            </div>
          </div>
          <div className="stat-icon-wrapper">
            <DollarSign size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Pending Intake Applications</div>
            <div className="stat-value" style={{ color: metrics.membership?.pendingApplications > 0 ? '#f59e0b' : '#fff' }}>
              {metrics.membership?.pendingApplications || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Google Forms & Direct</div>
          </div>
          <div className="stat-icon-wrapper">
            <FileText size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Verified Service Hours</div>
            <div className="stat-value">{metrics.service?.totalHours || 0}</div>
            <div style={{ fontSize: '0.75rem', color: '#34d399' }}>Delivered to communities</div>
          </div>
          <div className="stat-icon-wrapper">
            <Activity size={22} />
          </div>
        </div>
      </div>

      {/* Section: Pending Applications & Audit Trail */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '24px' }}>
        {/* Pending Intake Applications */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="card-title">
              <FileText size={18} color="var(--gold-400)" />
              Pending Intake Applications
            </h3>
            <button
              className="btn btn-sm btn-outline-gold"
              onClick={() => onNavigate('admin-applications')}
            >
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {metrics.recentApplications?.length > 0 ? (
              metrics.recentApplications.map((app: any) => (
                <div
                  key={app.id}
                  style={{
                    background: 'var(--bg-primary)',
                    padding: '14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                        {app.fullName}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-gold)' }}>
                        {app.occupation} • {app.city || 'United States'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Source: {app.source} ({app.email})
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="btn btn-sm"
                        style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid #10b981' }}
                        onClick={() => handleQuickApprove(app.id)}
                        title="Approve Member"
                      >
                        <Check size={14} /> Approve
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid #ef4444' }}
                        onClick={() => handleQuickReject(app.id)}
                        title="Decline"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '8px', fontStyle: 'italic', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '4px' }}>
                    "{app.reasonToJoin}"
                  </p>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No pending applications</p>
            )}
          </div>
        </div>

        {/* Live Immutable Audit Log */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="card-title">
              <Shield size={18} color="var(--gold-400)" />
              Security & Operational Audit Stream
            </h3>
            <button
              className="btn btn-sm btn-outline-gold"
              onClick={() => onNavigate('admin-audit')}
            >
              Full Trail
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {metrics.recentAuditLogs?.map((log: any) => (
              <div
                key={log.id}
                style={{
                  background: 'var(--bg-primary)',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.82rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#fff' }}>
                    <span style={{ color: 'var(--gold-400)' }}>[{log.action}]</span> {log.entity}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    By {log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System Engine'}
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {new Date(log.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
