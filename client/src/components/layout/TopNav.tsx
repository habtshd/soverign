import React, { useState, useEffect } from 'react';
import { useAuth, PortalType } from '../../context/AuthContext.js';
import { api } from '../../api/client.js';
import { Bell, Search, Check, ShieldAlert } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle.js';

interface TopNavProps {
  onSearch?: (query: string) => void;
}

export const TopNav: React.FC<TopNavProps> = () => {
  const { user, activePortal, setActivePortal } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any | null>(null);

  const isSuperAdminOrAdmin =
    user?.roles?.includes('SUPER_ADMIN') || user?.roles?.includes('ADMIN');
  const isOrganizer = user?.roles?.includes('ORGANIZER') || isSuperAdminOrAdmin;
  const isMentor = user?.roles?.includes('MENTOR') || isSuperAdminOrAdmin;
  const isFinance = user?.roles?.includes('FINANCE_MANAGER') || isSuperAdminOrAdmin;

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

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
      {/* Portal Switcher */}
      <div className="portal-switcher">
        <button
          className={`portal-btn ${activePortal === 'MEMBER' ? 'active' : ''}`}
          onClick={() => setActivePortal('MEMBER')}
        >
          Member
        </button>

        {isSuperAdminOrAdmin && (
          <button
            className={`portal-btn ${activePortal === 'ADMIN' ? 'active' : ''}`}
            onClick={() => setActivePortal('ADMIN')}
          >
            Admin
          </button>
        )}

        {isMentor && (
          <button
            className={`portal-btn ${activePortal === 'MENTOR' ? 'active' : ''}`}
            onClick={() => setActivePortal('MENTOR')}
          >
            Mentor
          </button>
        )}

        {isOrganizer && (
          <button
            className={`portal-btn ${activePortal === 'ORGANIZER' ? 'active' : ''}`}
            onClick={() => setActivePortal('ORGANIZER')}
          >
            Organizer
          </button>
        )}

        {isFinance && (
          <button
            className={`portal-btn ${activePortal === 'FINANCE' ? 'active' : ''}`}
            onClick={() => setActivePortal('FINANCE')}
          >
            Finance
          </button>
        )}
      </div>

      {/* Center Search Input */}
      <form onSubmit={handleSearch} style={{ position: 'relative', width: '320px' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Global system search..."
          style={{ paddingLeft: '34px', height: '36px', fontSize: '0.82rem' }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search
          size={16}
          style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }}
        />
      </form>

      {/* Right Actions */}
      <div className="topbar-actions">
        {/* Dark / Light Mode Switcher */}
        <ThemeToggle />

        <span className="role-badge">
          {activePortal} VIEW • {user?.roles?.[0] || 'GUEST'}
        </span>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-muted)',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              color: '#fff',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  background: 'var(--status-danger)',
                  color: '#fff',
                  borderRadius: '50%',
                  fontSize: '0.65rem',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Drawer */}
          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '46px',
                width: '350px',
                background: 'var(--bg-modal)',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg), var(--gold-glow)',
                zIndex: 1000,
                padding: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '8px',
                }}
              >
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>
                  Notifications ({unreadCount})
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-gold)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Check size={14} /> Mark all read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {notifications.length === 0 ? (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px' }}>
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        padding: '10px',
                        borderRadius: '6px',
                        background: n.isRead ? 'transparent' : 'rgba(201, 151, 56, 0.08)',
                        border: '1px solid',
                        borderColor: n.isRead ? 'var(--border-subtle)' : 'var(--border-gold)',
                      }}
                    >
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
                        {n.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {n.message}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {new Date(n.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
