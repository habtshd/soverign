import React, { useState, useEffect, useRef } from 'react';
import { useAuth, PortalType } from '../../context/AuthContext.js';
import { api } from '../../api/client.js';
import { Bell, Search, Check, ShieldAlert, ChevronDown, UserCheck } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle.js';
import { Avatar } from '../common/Avatar.js';

interface TopNavProps {
  onSearch?: (query: string) => void;
}

export const TopNav: React.FC<TopNavProps> = () => {
  const { user, activePortal, setActivePortal, quickSwitchUser } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const isSuperAdminOrAdmin =
    user?.roles?.includes('SUPER_ADMIN') || user?.roles?.includes('ADMIN');
  const isOrganizer = user?.roles?.includes('ORGANIZER') || isSuperAdminOrAdmin;
  const isMentor = user?.roles?.includes('MENTOR') || isSuperAdminOrAdmin;

  const demoAccounts = [
    { label: 'Admin (Council Architect)', name: 'Habtsh', email: 'pr/habtemariam/0001', role: 'ADMIN' },
    { label: 'Admin (Club Founder)', name: 'Eyob Haile', email: 'admin@sovereign.club', role: 'ADMIN' },
    { label: 'Leader / Organizer', name: 'Dawit Tadesse', email: 'organizer@sovereign.club', role: 'ORGANIZER' },
    { label: 'Founding Mentor', name: 'Yonas Kassa', email: 'mentor@sovereign.club', role: 'MENTOR' },
    { label: 'Sovereign Member', name: 'Alex Mercer', email: 'alex@sovereign.club', role: 'MEMBER' },
  ];

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowRoleDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await api.notifications.getMine();
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    } catch {
      // ignore
    }
  };

  const handleMarkAllRead = async () => {
    await api.notifications.markAllRead();
    loadNotifications();
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const res = await api.admin.search(searchQuery);
      if (res.success && res.data) {
        setSearchResults(res.data);
      }
    } catch {
      // ignore
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="topbar">


      {/* 2. Center: Sleek Modern Search Input */}
      <form onSubmit={handleSearch} className="topbar-search-form">
        <Search size={15} className="topbar-search-icon" />
        <input
          type="text"
          className="topbar-search-input"
          placeholder="Search members, events, records..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="search-shortcut">⌘K</span>
      </form>

      {/* 3. Right: Sleek Modern Actions */}
      <div className="topbar-actions">
        {/* Theme Toggle (Icon button) */}
        <ThemeToggle />

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="icon-btn"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notification-bubble">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    style={{ background: 'none', border: 'none', color: 'var(--text-gold)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    No unread notices
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        padding: '10px 12px',
                        background: n.isRead ? 'transparent' : 'rgba(201, 151, 56, 0.08)',
                        borderRadius: '6px',
                        borderLeft: n.isRead ? '2px solid transparent' : '2px solid var(--gold-400)',
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{n.title}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.35 }}>
                        {n.message}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Dropdown (No duplicate role text in header) */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="user-profile-btn"
            title={`${user?.firstName} ${user?.lastName} • ${user?.roles?.[0] || 'MEMBER'}`}
            aria-label="User account and switch test role"
          >
            <Avatar
              firstName={user?.firstName}
              lastName={user?.lastName}
              size={34}
            />
            <span className="user-online-dot" />
          </button>

          {showRoleDropdown && (
            <div className="role-dropdown-menu">
              <div className="role-dropdown-user-header">
                <Avatar
                  firstName={user?.firstName}
                  lastName={user?.lastName}
                  size={36}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-gold)', fontWeight: 600 }}>
                    {user?.roles?.[0] || 'MEMBER'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.email}
                  </div>
                </div>
              </div>

              <div className="role-dropdown-header">
                Switch Test Account
              </div>
              {demoAccounts.map((acc) => {
                const isActive = user?.email === acc.email;
                return (
                  <button
                    key={acc.email}
                    onClick={() => {
                      quickSwitchUser(acc.email);
                      setShowRoleDropdown(false);
                    }}
                    className={`role-dropdown-item ${isActive ? 'active' : ''}`}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{acc.label}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{acc.name}</div>
                    </div>
                    {isActive && <Check size={14} color="var(--gold-400)" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
