import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { Users, Search, CheckCircle, Shield, Award } from 'lucide-react';

export const AdminMembersView: React.FC = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [verifyingMember, setVerifyingMember] = useState<any | null>(null);
  const [verificationType, setVerificationType] = useState('INTERVIEW');
  const [verificationNotes, setVerificationNotes] = useState('');

  useEffect(() => {
    loadMembers();
  }, [search, statusFilter]);

  const loadMembers = async () => {
    const res = await api.members.getAll({
      search: search || undefined,
      status: statusFilter || undefined,
    });
    if (res.success && res.members) {
      setMembers(res.members);
    }
    setLoading(false);
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingMember) return;
    await api.members.verifyMember(verifyingMember.id, {
      verificationType,
      notes: verificationNotes,
    });
    setVerifyingMember(null);
    setVerificationNotes('');
    loadMembers();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sovereign Member Directory</h1>
          <p className="page-subtitle">
            Inspect verified credentials, digital member IDs, service hours, and council standing.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by name, ID code, city, profession..."
            style={{ paddingLeft: '36px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
        </div>

        <select
          className="form-select"
          style={{ width: '180px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Member ID</th>
              <th>Brother Name</th>
              <th>Tier</th>
              <th>City</th>
              <th>Service Hours</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-gold)', fontWeight: 600 }}>
                    {m.memberNumber}
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: '#fff' }}>
                    {m.user?.firstName} {m.user?.lastName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {m.user?.email}
                  </div>
                </td>
                <td>
                  <span className="badge badge-gold">
                    {m.membershipType?.name || 'General'}
                  </span>
                </td>
                <td>{m.profile?.city || 'United States'}</td>
                <td>
                  <strong>{m.serviceHoursTotal || 0} hrs</strong>
                </td>
                <td>
                  <span className={`badge ${m.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
                    {m.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-gold"
                    onClick={() => setVerifyingMember(m)}
                  >
                    <Shield size={13} /> Verify Badge
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Verification Modal */}
      {verifyingMember && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700 }}>
                Verify Member: {verifyingMember.user?.firstName} {verifyingMember.user?.lastName}
              </h3>
              <button onClick={() => setVerifyingMember(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleVerifySubmit}>
              <div className="form-group">
                <label className="form-label">Verification Method</label>
                <select
                  className="form-select"
                  value={verificationType}
                  onChange={(e) => setVerificationType(e.target.value)}
                >
                  <option value="INTERVIEW">Executive Intake Interview</option>
                  <option value="ID_DOCUMENT">Official Government ID & Biometrics</option>
                  <option value="BACKGROUND_CHECK">Security & Financial Background Verification</option>
                  <option value="COUNCIL_VOUCH">Council Sponsor Vouch</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Verification Notes & Findings</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Record council findings or verification remarks..."
                  required
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setVerifyingMember(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Certify Verification</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
