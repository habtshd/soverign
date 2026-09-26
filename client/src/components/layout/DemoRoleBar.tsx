import React from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { Users } from 'lucide-react';

export const DemoRoleBar: React.FC = () => {
  const { user, quickSwitchUser } = useAuth();

  const accounts = [
    { label: 'Super Admin (Marcus)', email: 'admin@sovereign.club', role: 'SUPER_ADMIN' },
    { label: 'Organizer (David)', email: 'organizer@sovereign.club', role: 'ORGANIZER' },
    { label: 'Mentor (James)', email: 'mentor@sovereign.club', role: 'MENTOR' },
    { label: 'Finance (Ethan)', email: 'finance@sovereign.club', role: 'FINANCE_MANAGER' },
    { label: 'Brother (Alex)', email: 'alex@sovereign.club', role: 'MEMBER' },
  ];

  return (
    <div className="demo-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Users size={14} />
        <span style={{ fontWeight: 600 }}>DEMO ROLE TESTER:</span>
      </div>
      <div className="demo-account-pills">
        {accounts.map((acc) => {
          const isActive = user?.email === acc.email;
          return (
            <button
              key={acc.email}
              className={`demo-pill ${isActive ? 'active' : ''}`}
              onClick={() => quickSwitchUser(acc.email)}
              title={`Switch to ${acc.email}`}
            >
              {acc.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
