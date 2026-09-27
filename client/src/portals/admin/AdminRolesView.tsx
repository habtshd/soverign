import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { Avatar } from '../../components/common/Avatar.js';
import { ShieldCheck, UserCheck, Key, Lock, CheckCircle, Search, ShieldAlert, Award } from 'lucide-react';

export const AdminRolesView: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'matrix'>('users');

  const standardRoles = ['SUPER_ADMIN', 'ADMIN', 'ORGANIZER', 'MENTOR', 'MEMBER'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [uRes, rRes] = await Promise.all([
      api.admin.getUsers(),
      api.admin.getRoles(),
    ]);

    if (uRes.success && uRes.data) setUsers(uRes.data);
    if (rRes.success && rRes.data) setRoles(rRes.data);
    setLoading(false);
  };

  const handleSelectUser = (u: any) => {
    setSelectedUser(u);
    const currentRoleNames = u.roles?.map((r: any) => r.role?.name || r.name) || [];
    setSelectedRoles(currentRoleNames);
    setSaveSuccess(false);
  };

  const toggleRole = (roleName: string) => {
    if (selectedRoles.includes(roleName)) {
      // Must keep at least one role
      if (selectedRoles.length > 1) {
        setSelectedRoles(selectedRoles.filter((r) => r !== roleName));
      }
    } else {
      setSelectedRoles([...selectedRoles, roleName]);
    }
  };

  const handleSaveRoles = async () => {
    if (!selectedUser) return;
    const res = await api.admin.assignRoles(selectedUser.id, selectedRoles);
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      loadData();
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchQuery.toLowerCase();
    const name = `${u.firstName} ${u.lastName}`.toLowerCase();
    const email = (u.email || '').toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Users, Roles & Access Control</h1>
          <p className="page-subtitle">
            Govern role-based permissions across the four primary roles: Member, Mentor, Leader/Organizer, and Admin.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('users')}
          >
            <UserCheck size={14} /> User Role Assignment
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'matrix' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('matrix')}
          >
            <Key size={14} /> Permissions Matrix
          </button>
        </div>
      </div>

      {activeTab === 'users' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '24px' }}>
          {/* User Roster */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>System Users ({users.length})</h3>
            </div>

            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search user or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '32px', height: '36px', fontSize: '0.85rem' }}
              />
              <Search size={14} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--text-muted)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '560px', overflowY: 'auto' }}>
              {filteredUsers.map((u) => {
                const isSelected = selectedUser?.id === u.id;
                const userRoleNames = u.roles?.map((r: any) => r.role?.name || r.name) || [];

                return (
                  <div
                    key={u.id}
                    onClick={() => handleSelectUser(u)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      background: isSelected ? 'var(--gold-500-10)' : 'var(--bg-primary)',
                      border: isSelected ? '1px solid var(--gold-500)' : '1px solid var(--border-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                        {u.firstName} {u.lastName}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {u.member?.memberNumber || 'SYSTEM'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {u.email}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                      {userRoleNames.map((rn: string) => (
                        <span
                          key={rn}
                          className="badge"
                          style={{
                            fontSize: '0.65rem',
                            padding: '1px 6px',
                            background:
                              rn === 'SUPER_ADMIN' || rn === 'ADMIN'
                                ? 'rgba(217, 119, 6, 0.2)'
                                : rn === 'ORGANIZER'
                                ? 'rgba(59, 130, 246, 0.2)'
                                : rn === 'MENTOR'
                                ? 'rgba(16, 185, 129, 0.2)'
                                : 'rgba(255, 255, 255, 0.08)',
                            color:
                              rn === 'SUPER_ADMIN' || rn === 'ADMIN'
                                ? 'var(--text-gold)'
                                : rn === 'ORGANIZER'
                                ? '#60a5fa'
                                : rn === 'MENTOR'
                                ? '#34d399'
                                : 'var(--text-secondary)',
                          }}
                        >
                          {rn}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Role Configuration Panel */}
          {selectedUser ? (
            <div className="card card-gold-border">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-muted)' }}>
                <Avatar
                  firstName={selectedUser.firstName}
                  lastName={selectedUser.lastName}
                  size={52}
                />
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h2>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {selectedUser.email} • {selectedUser.phone || 'No phone'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-gold)', marginTop: '2px' }}>
                    Member ID: {selectedUser.member?.memberNumber || 'N/A'} • Status: {selectedUser.status}
                  </div>
                </div>
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>
                Role Assignment for Sovereign Portal Access
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.4 }}>
                Select which portals and capabilities this user can access. Each role unlocks the respective user portal.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {[
                  {
                    role: 'MEMBER',
                    title: '1. MEMBER (Regular Club Member)',
                    desc: 'Grants access to Member Portal: Digital ID, Creed, Events, Learning, Fitness, Business, Mentorship & Service.',
                    badgeColor: 'var(--text-secondary)',
                  },
                  {
                    role: 'MENTOR',
                    title: '2. MENTOR (Council Mentor)',
                    desc: 'Grants access to Mentor Portal: Assigned mentees, matching, 1-on-1 sessions, notes, goals and mentorship reports.',
                    badgeColor: '#10b981',
                  },
                  {
                    role: 'ORGANIZER',
                    title: '3. LEADER / ORGANIZER',
                    desc: 'Grants access to Leader/Organizer Portal: Programs, event attendance scanner, challenges, service projects, member participation.',
                    badgeColor: '#3b82f6',
                  },
                  {
                    role: 'ADMIN',
                    title: '4. ADMIN (Club & System Administrator)',
                    desc: 'Grants access to Admin Portal: Members directory, verification & intake, role management, treasury, content, integrations and backups.',
                    badgeColor: 'var(--text-gold)',
                  },
                  {
                    role: 'SUPER_ADMIN',
                    title: 'SUPER ADMIN (Full Council Authority)',
                    desc: 'Executive access with root authorization over all systems, destructive actions, and treasury operations.',
                    badgeColor: '#f59e0b',
                  },
                ].map((item) => {
                  const isChecked = selectedRoles.includes(item.role);
                  return (
                    <div
                      key={item.role}
                      onClick={() => toggleRole(item.role)}
                      style={{
                        padding: '14px',
                        borderRadius: '8px',
                        border: isChecked ? '1px solid var(--gold-500)' : '1px solid var(--border-muted)',
                        background: isChecked ? 'var(--gold-500-10)' : 'var(--bg-primary)',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        style={{ marginTop: '3px', cursor: 'pointer' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isChecked ? 'var(--text-gold)' : 'inherit' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {saveSuccess && (
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', padding: '10px 14px', borderRadius: '8px', color: '#10b981', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <CheckCircle size={16} /> Roles successfully updated for {selectedUser.firstName}!
                </div>
              )}

              <button className="btn btn-primary" onClick={handleSaveRoles} style={{ width: '100%' }}>
                <ShieldCheck size={16} /> Save Role Assignments
              </button>
            </div>
          ) : (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '350px', color: 'var(--text-muted)', textAlign: 'center' }}>
              <Lock size={40} style={{ opacity: 0.4, marginBottom: '12px' }} />
              <div style={{ fontSize: '1.05rem', fontWeight: 600 }}>Select a User to Manage Roles</div>
              <p style={{ fontSize: '0.85rem', maxWidth: '300px', marginTop: '6px' }}>
                Pick any registered brother or executive from the list on the left to review or reassign their portal permissions.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'matrix' && (
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
            Role-Based Access Control (RBAC) Permission Matrix
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Authorized capabilities defined across the four core Sovereign platform user roles.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Platform Capability / Module</th>
                  <th style={{ textAlign: 'center' }}>MEMBER</th>
                  <th style={{ textAlign: 'center' }}>MENTOR</th>
                  <th style={{ textAlign: 'center' }}>LEADER / ORGANIZER</th>
                  <th style={{ textAlign: 'center' }}>ADMIN</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { module: 'Personal Profile & Digital ID Card', member: true, mentor: true, organizer: true, admin: true },
                  { module: 'Event Registration & Attendance History', member: true, mentor: true, organizer: true, admin: true },
                  { module: 'Curriculum & Sovereign Podcasts Access', member: true, mentor: true, organizer: true, admin: true },
                  { module: 'Fitness & Spartan Challenge Benchmarks', member: true, mentor: true, organizer: true, admin: true },
                  { module: 'Capital Syndicates & Career Board', member: true, mentor: true, organizer: true, admin: true },
                  { module: 'Volunteer for Community Service', member: true, mentor: true, organizer: true, admin: true },
                  { module: 'Mentorship 1-on-1 Sessions (as Mentee)', member: true, mentor: false, organizer: true, admin: true },
                  { module: 'Mentorship Command (as Mentor & Guide)', member: false, mentor: true, organizer: false, admin: true },
                  { module: 'Goal Setting & Mentee Progress Tracking', member: false, mentor: true, organizer: false, admin: true },
                  { module: 'Manage Programs, Activities & Rucks', member: false, mentor: false, organizer: true, admin: true },
                  { module: 'Physical QR Event Attendance Scanner', member: false, mentor: false, organizer: true, admin: true },
                  { module: 'Challenge Creation & Verification', member: false, mentor: false, organizer: true, admin: true },
                  { module: 'Service Project Lead & Hours Approval', member: false, mentor: false, organizer: true, admin: true },
                  { module: 'Member Directory & Profile Administration', member: false, mentor: false, organizer: false, admin: true },
                  { module: 'Membership Verification & Digital ID Issuance', member: false, mentor: false, organizer: false, admin: true },
                  { module: 'User Role & Permissions Management', member: false, mentor: false, organizer: false, admin: true },
                  { module: 'Treasury, Dues Invoicing & Expense Approvals', member: false, mentor: false, organizer: false, admin: true },
                  { module: 'Google Forms, Sheets & Telegram Integration', member: false, mentor: false, organizer: false, admin: true },
                  { module: 'Security Audit Logs & Database Backups', member: false, mentor: false, organizer: false, admin: true },
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{row.module}</td>
                    <td style={{ textAlign: 'center' }}>
                      {row.member ? <CheckCircle size={18} color="#10b981" style={{ margin: '0 auto' }} /> : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {row.mentor ? <CheckCircle size={18} color="#10b981" style={{ margin: '0 auto' }} /> : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {row.organizer ? <CheckCircle size={18} color="#10b981" style={{ margin: '0 auto' }} /> : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {row.admin ? <CheckCircle size={18} color="var(--gold-400)" style={{ margin: '0 auto' }} /> : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
