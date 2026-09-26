import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { Briefcase, DollarSign, Building, Users, Send, Check } from 'lucide-react';

export const MemberBusinessView: React.FC = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [network, setNetwork] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'syndicates' | 'network' | 'jobs'>('syndicates');
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [coverNote, setCoverNote] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    loadBusinessData();
  }, []);

  const loadBusinessData = async () => {
    const [oRes, nRes, jRes] = await Promise.all([
      api.business.getOpportunities(),
      api.business.getNetwork(),
      api.business.getJobs(),
    ]);

    if (oRes.success && oRes.data) setOpportunities(oRes.data);
    if (nRes.success && nRes.data) setNetwork(nRes.data);
    if (jRes.success && jRes.data) setJobs(jRes.data);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJobId) return;
    const res = await api.business.applyJob(applyingJobId, { coverNote });
    if (res.success) {
      setApplySuccess(true);
      setTimeout(() => {
        setApplySuccess(false);
        setApplyingJobId(null);
        setCoverNote('');
      }, 2000);
      loadBusinessData();
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Money, Business & Career</h1>
          <p className="page-subtitle">
            Capital deployment, vetted syndicates, executive careers, and sovereign business alliances.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-sm ${activeTab === 'syndicates' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('syndicates')}
          >
            <DollarSign size={14} /> Syndicates
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'network' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('network')}
          >
            <Building size={14} /> Business Directory
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'jobs' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('jobs')}
          >
            <Briefcase size={14} /> Career Board
          </button>
        </div>
      </div>

      {activeTab === 'syndicates' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {opportunities.map((opp) => (
            <div key={opp.id} className="card card-gold-border">
              <span className="badge badge-gold" style={{ marginBottom: '10px' }}>VETTED ALLOCATION</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                {opp.title}
              </h3>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-gold)', marginBottom: '12px', fontWeight: 600 }}>
                {opp.company}
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px' }}>
                {opp.description}
              </p>

              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Target Investment Range
                </div>
                <div style={{ fontSize: '1rem', color: '#fff', fontWeight: 700, marginTop: '2px' }}>
                  {opp.investmentRange || 'Inquire'}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Contact: {opp.contactPerson}</span>
                <a href={`mailto:${opp.contactEmail || 'syndicate@sovereign.club'}`} className="btn btn-sm btn-outline-gold">
                  Inquire Terms
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'network' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {network.map((b) => (
            <div key={b.id} className="card">
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                {b.businessName}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-gold)', marginBottom: '10px' }}>
                {b.industry} • Owner: {b.member?.user?.firstName} {b.member?.user?.lastName}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                {b.description}
              </p>
              {b.lookingFor && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <strong>Seeking:</strong> {b.lookingFor}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'jobs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {jobs.map((job) => (
            <div key={job.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span className="badge badge-gold">{job.employmentType}</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginTop: '6px' }}>
                  {job.title}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-gold)', marginTop: '2px' }}>
                  {job.company} • {job.location} • {job.salaryRange || 'Competitive'}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '8px', maxWidth: '700px', lineHeight: '1.5' }}>
                  {job.description}
                </p>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => setApplyingJobId(job.id)}
              >
                Apply for Role
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Application Modal */}
      {applyingJobId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700 }}>Submit Application</h3>
              <button onClick={() => setApplyingJobId(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
            </div>
            {applySuccess ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#10b981' }}>
                <Check size={36} style={{ margin: '0 auto 8px auto', display: 'block' }} />
                <h3>Application Submitted!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Your profile has been forwarded to the hiring brother.</p>
              </div>
            ) : (
              <form onSubmit={handleApply}>
                <div className="form-group">
                  <label className="form-label">Brief Introduction & Sovereign Qualifications</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="Why are you the right brother for this high-responsibility role?"
                    required
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setApplyingJobId(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Transmit Application</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
