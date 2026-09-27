import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { BarChart3, TrendingUp, Users, Calendar, Award, DollarSign, Download, ArrowUpRight } from 'lucide-react';

export const AdminReportsView: React.FC = () => {
  const [reports, setReports] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    const res = await api.admin.getReports();
    if (res.success && res.data) {
      setReports(res.data);
    }
    setLoading(false);
  };

  const handleExportCSV = () => {
    if (!reports) return;
    const rows = [
      ['Metric', 'Value'],
      ['Growth Rate', reports.growthRate],
      ['Active Membership Ratio', `${reports.activeRatio}%`],
      ['Total Event Turnout', reports.totalAttendance],
      ['Average Turnout per Event', reports.avgAttendancePerEvent],
      ['Total Service Hours Logged', reports.totalServiceHours],
      ['Total Revenue Inflow', `$${reports.totalRevenue}`],
      ['Net Sovereign Treasury', `$${reports.netTreasury}`],
      ['Mentorship Goal Completion', `${reports.goalCompletionRate}%`],
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sovereign_executive_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Reports & Intelligence</h1>
          <p className="page-subtitle">
            Comprehensive operational analytics covering membership velocity, event turnout, treasury health, and brotherhood impact.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleExportCSV}>
          <Download size={16} /> Export Executive Intelligence CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="metrics-grid">
        <div className="stat-card">
          <div>
            <div className="stat-label">Membership Velocity</div>
            <div className="stat-value" style={{ color: 'var(--text-gold)' }}>
              {reports?.growthRate || '+14.2%'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981' }}>{reports?.activeRatio || 95}% Active Standing</div>
          </div>
          <div className="stat-icon-wrapper">
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Event Attendance Rate</div>
            <div className="stat-value">
              {reports?.totalAttendance || 28} check-ins
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avg {reports?.avgAttendancePerEvent || 14} per summit</div>
          </div>
          <div className="stat-icon-wrapper">
            <Calendar size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Civic Service Hours</div>
            <div className="stat-value" style={{ color: '#38bdf8' }}>
              {reports?.totalServiceHours || 150} hrs
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981' }}>Community Impact Logged</div>
          </div>
          <div className="stat-icon-wrapper">
            <Award size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Treasury Capital</div>
            <div className="stat-value" style={{ color: '#10b981' }}>
              ${reports?.netTreasury?.toLocaleString() || '18,500'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reserves & Dues Collected</div>
          </div>
          <div className="stat-icon-wrapper">
            <DollarSign size={22} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginTop: '24px' }}>
        {/* Development & Mentorship Metric */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
            Mentorship & Development Velocity
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Tracking brother accountability across the 5 Sovereign pillars.
          </p>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span>5-Pillar Goal Completion Index</span>
              <span style={{ fontWeight: 700, color: 'var(--text-gold)' }}>{reports?.goalCompletionRate || 85}%</span>
            </div>
            <div className="progress-bar-bg" style={{ height: '10px' }}>
              <div className="progress-bar-fill" style={{ width: `${reports?.goalCompletionRate || 85}%` }}></div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.85rem' }}>Active 1-on-1 Mentorship Pairs</span>
              <span style={{ fontWeight: 700 }}>4 Active Cohorts</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.85rem' }}>Monthly Mentorship Hours Invested</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>32.5 Hours</span>
            </div>
          </div>
        </div>

        {/* Member Tiers Distribution */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
            Membership Tier Stratification
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Verified brotherhood roster distribution.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { name: 'Founding Member (Lifetime Council)', count: 2, fee: '$1,200/yr', pct: '25%' },
              { name: 'Executive Member (Masterminds & Syndicates)', count: 3, fee: '$600/yr', pct: '38%' },
              { name: 'Sovereign Brother (General Tier)', count: 5, fee: '$300/yr', pct: '62%' },
              { name: 'Rising Sovereign (Youth Leadership)', count: 2, fee: '$150/yr', pct: '25%' },
            ].map((tier, idx) => (
              <div key={idx} style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{tier.name}</div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-gold)', fontWeight: 700 }}>{tier.fee}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <div className="progress-bar-bg" style={{ width: '75%', height: '6px' }}>
                    <div className="progress-bar-fill" style={{ width: tier.pct }}></div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tier.count} Brothers</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
