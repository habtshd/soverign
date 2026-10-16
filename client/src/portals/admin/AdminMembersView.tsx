import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { formatMemberId } from '../../utils/formatters.js';
import { Users, Search, CheckCircle, Shield, Award, UserPlus } from 'lucide-react';

export const AdminMembersView: React.FC = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [verifyingMember, setVerifyingMember] = useState<any | null>(null);
  const [verificationType, setVerificationType] = useState('INTERVIEW');
  const [verificationNotes, setVerificationNotes] = useState('');

  // Add Member State
  const [showAddModal, setShowAddModal] = useState(false);
  const [membershipTypes, setMembershipTypes] = useState<any[]>([]);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);
  const [addFormData, setAddFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: 'Sovereign2026!',
    phone: '',
    city: 'Addis Ababa, Ethiopia',
    profession: '',
    company: '',
    telegramHandle: '',
    membershipTypeId: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    loadMembers();
    loadMembershipTypes();
  }, [search, statusFilter]);

  const loadMembershipTypes = async () => {
    try {
      const res = await api.members.getTypes();
      if (res.success && res.data) {
        setMembershipTypes(res.data);
        if (res.data.length > 0 && !addFormData.membershipTypeId) {
          setAddFormData(prev => ({ ...prev, membershipTypeId: res.data[0].id }));
        }
      }
    } catch (err) {
      console.error('Failed to load membership types:', err);
    }
  };

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

  const generatePasskey = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'SOV-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAddFormData(prev => ({ ...prev, password: code + '!' }));
  };

  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    setAddSuccess(null);
    try {
      const res = await api.members.create(addFormData);
      if (res.success && res.data) {
        setAddSuccess(`Brother ${res.data.user?.firstName || addFormData.firstName} enrolled successfully with Member ID: ${formatMemberId(res.data.memberNumber)}`);
        await loadMembers();
        setTimeout(() => {
          setShowAddModal(false);
          setAddSuccess(null);
          setAddFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: 'Sovereign2026!',
            phone: '',
            city: 'Addis Ababa, Ethiopia',
            profession: '',
            company: '',
            telegramHandle: '',
            membershipTypeId: membershipTypes[0]?.id || '',
            status: 'ACTIVE',
          });
        }, 1200);
      } else {
        setAddError(res.error || 'Failed to enroll member');
      }
    } catch (err: any) {
      setAddError(err.message || 'An error occurred while enrolling member');
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">Sovereign Member Directory</h1>
          <p className="page-subtitle">
            Inspect verified credentials, digital member IDs, service hours, and council standing.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setAddError(null);
            setAddSuccess(null);
            setShowAddModal(true);
          }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontWeight: 700 }}
        >
          <UserPlus size={16} />
          <span>Add Member</span>
        </button>
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
                    {formatMemberId(m.memberNumber)}
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

      {/* Add Member Enrollment Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={20} className="text-gold" />
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 700, margin: 0 }}>
                    Enroll Sovereign Brother
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                    Direct council member registration & credential provisioning
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            {addError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#ef4444',
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '0.85rem'
              }}>
                {addError}
              </div>
            )}

            {addSuccess && (
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.25)',
                color: '#22c55e',
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '0.85rem'
              }}>
                {addSuccess}
              </div>
            )}

            <form onSubmit={handleAddMemberSubmit}>
              {/* Names */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Dawit"
                    required
                    value={addFormData.firstName}
                    onChange={(e) => setAddFormData({ ...addFormData, firstName: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Tadesse"
                    required
                    value={addFormData.lastName}
                    onChange={(e) => setAddFormData({ ...addFormData, lastName: e.target.value })}
                  />
                </div>
              </div>

              {/* Email & Passkey */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="brother@sovereign.club"
                    required
                    value={addFormData.email}
                    onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label">Passkey *</label>
                    <button
                      type="button"
                      onClick={generatePasskey}
                      style={{ background: 'none', border: 'none', color: 'var(--text-gold)', fontSize: '0.72rem', cursor: 'pointer', padding: 0 }}
                    >
                      Generate Key
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Temporary Passkey"
                    required
                    value={addFormData.password}
                    onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })}
                  />
                </div>
              </div>

              {/* Phone & Telegram */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+251 91 123 4567"
                    value={addFormData.phone}
                    onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Telegram Handle</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="@username"
                    value={addFormData.telegramHandle}
                    onChange={(e) => setAddFormData({ ...addFormData, telegramHandle: e.target.value })}
                  />
                </div>
              </div>

              {/* City & Profession */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">City, Territory</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Addis Ababa, Ethiopia"
                    value={addFormData.city}
                    onChange={(e) => setAddFormData({ ...addFormData, city: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Profession / Trade</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Software Architect, Enterprise"
                    value={addFormData.profession}
                    onChange={(e) => setAddFormData({ ...addFormData, profession: e.target.value })}
                  />
                </div>
              </div>

              {/* Tier & Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '22px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Membership Tier</label>
                  <select
                    className="form-select"
                    value={addFormData.membershipTypeId}
                    onChange={(e) => setAddFormData({ ...addFormData, membershipTypeId: e.target.value })}
                  >
                    {membershipTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                    {membershipTypes.length === 0 && (
                      <option value="">Standard Member</option>
                    )}
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Account Standing</label>
                  <select
                    className="form-select"
                    value={addFormData.status}
                    onChange={(e) => setAddFormData({ ...addFormData, status: e.target.value })}
                  >
                    <option value="ACTIVE">Active (Certified)</option>
                    <option value="PENDING">Pending (Probationary)</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                  disabled={addLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={addLoading}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <UserPlus size={15} />
                  <span>{addLoading ? 'Enrolling...' : 'Enroll Sovereign Brother'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
