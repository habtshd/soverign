import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { Briefcase, Building, MapPin, DollarSign, Send, CheckCircle, Plus } from 'lucide-react';

export const MemberCareerView: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [coverNote, setCoverNote] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);

  // New Job post form
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Addis Ababa (Hybrid)');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const res = await api.business.getJobs();
    if (res.success && res.data) {
      setJobs(res.data);
    }
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
      loadJobs();
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !company.trim()) return;

    await api.business.createJob({
      title: jobTitle,
      company,
      location,
      salaryRange: salary,
      description,
    });

    setShowPostModal(false);
    setJobTitle('');
    setCompany('');
    setSalary('');
    setDescription('');
    loadJobs();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Career Opportunities & Executive Board</h1>
          <p className="page-subtitle">
            Exclusive career paths, brotherhood hiring alliances, and executive leadership placements across sovereign enterprises.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowPostModal(true)}>
          <Plus size={16} /> Post Hiring Opportunity
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {jobs.map((job) => (
          <div key={job.id} className="card card-gold-border">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="badge badge-gold">VERIFIED BROTHERHOOD ROLE</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {job.applications?.length || 0} Applicants
              </span>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>
              {job.title}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-gold)', fontSize: '0.88rem', fontWeight: 600, marginBottom: '10px' }}>
              <Building size={14} />
              <span>{job.company}</span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              {job.description}
            </p>

            <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-muted)', paddingTop: '12px', marginBottom: '16px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} /> {job.location || 'Addis Ababa'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981' }}>
                <DollarSign size={13} /> {job.salaryRange || 'Competitive'}
              </span>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => setApplyingJobId(job.id)}
            >
              <Send size={15} /> Apply via Sovereign Network
            </button>
          </div>
        ))}
      </div>

      {/* Apply Modal */}
      {applyingJobId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>
              Apply for Brotherhood Opportunity
            </h3>

            <form onSubmit={handleApply}>
              <div className="form-group">
                <label className="form-label">Cover Statement & Sovereign Credentials</label>
                <textarea
                  className="form-input"
                  rows={4}
                  required
                  placeholder="Summarize your professional qualifications, work ethic, and why you are suited to serve in this capacity..."
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                />
              </div>

              {applySuccess && (
                <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', marginBottom: '12px' }}>
                  <CheckCircle size={16} /> Application submitted directly to brother hiring lead!
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Submit Credentials
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setApplyingJobId(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {showPostModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>
              Post Career Role for Sovereign Brothers
            </h3>

            <form onSubmit={handlePostJob}>
              <div className="form-group">
                <label className="form-label">Role Title</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Senior Project Director"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Enterprise / Company</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Sovereign Capital Partners"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Compensation Range</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. $40k - $60k"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Role Mandate & Responsibilities</label>
                <textarea
                  className="form-input"
                  rows={3}
                  required
                  placeholder="Describe expectations and key requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Post Opportunity
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowPostModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
