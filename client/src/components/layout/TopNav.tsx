import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth, PortalType } from '../../context/AuthContext.js';
import { useTheme } from '../../context/ThemeContext.js';
import { api } from '../../api/client.js';
import {
  Bell,
  Search,
  Check,
  ChevronDown,
  LogOut,
  Shield,
  Compass,
  Workflow,
  Users,
  CreditCard,
  Calendar,
  BookOpen,
  DollarSign,
  Settings,
  X,
  Activity,
  CheckCircle2,
  User as UserIcon,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle.js';
import { Avatar } from '../common/Avatar.js';

interface TopNavProps {
  currentTab?: string;
  onNavigate?: (tab: string) => void;
  onSearch?: (query: string) => void;
}

const tabLabels: Record<string, { title: string; category: string; icon: any }> = {
  // Member Portal
  'member-home': { title: 'Overview', category: 'Brotherhood', icon: Users },
  'member-card': { title: 'Digital ID Card', category: 'Brotherhood', icon: CreditCard },
  'member-events': { title: 'Gatherings & Events', category: 'Brotherhood', icon: Calendar },
  'member-learning': { title: 'Curriculum & Growth', category: 'Brotherhood', icon: BookOpen },
  'member-mentorship': { title: 'Mentorship', category: 'Brotherhood', icon: Compass },
  'member-fitness': { title: 'Physical Mastery', category: 'Brotherhood', icon: Activity },
  'member-business': { title: 'Venture Network', category: 'Brotherhood', icon: Workflow },
  'member-community': { title: 'Brotherhood Circle', category: 'Brotherhood', icon: Users },
  'member-profile': { title: 'Member Dossier', category: 'Brotherhood', icon: UserIcon },

  // Mentor Portal
  'mentor-mentees': { title: 'Mentee Roster', category: 'Mentorship', icon: Users },
  'mentor-matching': { title: 'Cohort Matching', category: 'Mentorship', icon: Compass },
  'mentor-sessions': { title: 'Counsel Sessions', category: 'Mentorship', icon: Calendar },
  'mentor-reports': { title: 'Progress Reports', category: 'Mentorship', icon: BookOpen },

  // Organizer Portal
  'organizer-dashboard': { title: 'Operations Center', category: 'Leadership', icon: Workflow },
  'organizer-programs': { title: 'Active Programs', category: 'Leadership', icon: Activity },
  'organizer-events': { title: 'Event Operations', category: 'Leadership', icon: Calendar },
  'organizer-checkin': { title: 'Attendance Check-in', category: 'Leadership', icon: CheckCircle2 },

  // Admin Portal
  'admin-dashboard': { title: 'Executive Dashboard', category: 'Council Admin', icon: Shield },
  'admin-members': { title: 'Member Registry', category: 'Council Admin', icon: Users },
  'admin-applications': { title: 'Induction Pipeline', category: 'Council Admin', icon: Users },
  'admin-roles': { title: 'Roles & Council', category: 'Council Admin', icon: Shield },
  'admin-events': { title: 'Events Governance', category: 'Council Admin', icon: Calendar },
  'admin-finance': { title: 'Financial Ledger', category: 'Council Admin', icon: DollarSign },
  'admin-reports': { title: 'Intelligence Reports', category: 'Council Admin', icon: BookOpen },
  'admin-settings': { title: 'System Governance', category: 'Council Admin', icon: Settings },
};

const portalConfig: Record<string, { label: string; icon: any }> = {
  ADMIN: { label: 'Council Admin', icon: Shield },
  MENTOR: { label: 'Mentorship', icon: Compass },
  ORGANIZER: { label: 'Operations', icon: Workflow },
  MEMBER: { label: 'Brotherhood', icon: Users },
};

export const TopNav: React.FC<TopNavProps> = ({ currentTab = 'member-home', onNavigate }) => {
  const { user, activePortal, setActivePortal, quickSwitchUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showPortalDropdown, setShowPortalDropdown] = useState(false);

  // Command Palette & Search State
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState('');
  const [memberResults, setMemberResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const portalDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const availablePortals = useMemo(() => {
    const list: { key: PortalType; label: string; icon: any; desc: string }[] = [];
    const roles: string[] = user?.roles || [];
    const isAdmin = roles.includes('SUPER_ADMIN') || roles.includes('ADMIN');
    const isOrganizer = roles.includes('ORGANIZER');
    const isMentor = roles.includes('MENTOR');

    if (isAdmin) {
      list.push({ key: 'ADMIN', label: 'Council Admin', icon: Shield, desc: 'Governance, Members & Systems' });
    }
    if (isOrganizer || isAdmin) {
      list.push({ key: 'ORGANIZER', label: 'Operations', icon: Workflow, desc: 'Programs, Events & Operations' });
    }
    if (isMentor || isAdmin) {
      list.push({ key: 'MENTOR', label: 'Mentorship', icon: Compass, desc: 'Mentees & Inner Circle' });
    }
    list.push({ key: 'MEMBER', label: 'Brotherhood', icon: Users, desc: 'Digital ID, Academy & Community' });

    return list;
  }, [user]);

  const demoAccounts = [
    { label: 'Council Architect', name: 'Habtsh', email: 'pr/habtemariam/0001', role: 'ADMIN' },
    { label: 'Founding Member', name: 'Meaza', email: 'sp/meaza/0001', role: 'MEMBER' },
    { label: 'Club Founder', name: 'Eyob Haile', email: 'admin@sovereign.club', role: 'ADMIN' },
    { label: 'Leader & Organizer', name: 'Dawit Tadesse', email: 'organizer@sovereign.club', role: 'ORGANIZER' },
    { label: 'Founding Mentor', name: 'Yonas Kassa', email: 'mentor@sovereign.club', role: 'MENTOR' },
    { label: 'Sovereign Member', name: 'Alex Mercer', email: 'alex@sovereign.club', role: 'MEMBER' },
  ];

  const userRoleBadge = user?.roles?.includes('SUPER_ADMIN')
    ? 'Architect'
    : user?.roles?.includes('ADMIN')
    ? 'Admin'
    : user?.roles?.includes('ORGANIZER')
    ? 'Leader'
    : user?.roles?.includes('MENTOR')
    ? 'Mentor'
    : 'Brother';

  const userRoleTitle = user?.roles?.includes('SUPER_ADMIN')
    ? 'Council Architect'
    : user?.roles?.includes('ADMIN')
    ? 'Admin'
    : user?.roles?.includes('ORGANIZER')
    ? 'Organizer'
    : user?.roles?.includes('MENTOR')
    ? 'Mentor'
    : 'Brother';

  const currentTabInfo = tabLabels[currentTab] || {
    title: 'Overview',
    category: 'Sovereign',
    icon: Users,
  };

  const currentPortalInfo = portalConfig[activePortal] || {
    label: 'Brotherhood',
    icon: Users,
  };

  const PortalIcon = currentPortalInfo.icon;

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  // Global keyboard shortcut listener: Cmd+K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setShowRoleDropdown(false);
        setShowNotifications(false);
        setShowPortalDropdown(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowRoleDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (portalDropdownRef.current && !portalDropdownRef.current.contains(e.target as Node)) {
        setShowPortalDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when palette opens
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setSelectedIndex(0);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setPaletteQuery('');
      setMemberResults([]);
    }
  }, [isCommandPaletteOpen]);

  // Search members when paletteQuery changes
  useEffect(() => {
    if (!paletteQuery.trim() || paletteQuery.length < 2) {
      setMemberResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await api.admin.search(paletteQuery);
        if (res.success && res.data?.members) {
          setMemberResults(res.data.members);
        } else {
          // fallback to members getAll
          const fallbackRes = await api.members.getAll({ search: paletteQuery });
          if (fallbackRes.success && fallbackRes.data) {
            setMemberResults(fallbackRes.data.slice(0, 5));
          }
        }
      } catch {
        // silent fail
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [paletteQuery]);

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

  // Build searchable items in command palette
  const matchingTabs = Object.entries(tabLabels)
    .filter(([key, item]) => {
      if (!paletteQuery.trim()) {
        // Show prominent default shortcuts
        return ['member-card', 'member-events', 'admin-members', 'admin-dashboard'].includes(key);
      }
      const q = paletteQuery.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    })
    .slice(0, 6);

  const actions = [
    {
      id: 'action-theme',
      title: theme === 'light' ? 'Switch to Obsidian Dark Mode' : 'Switch to Ivory Light Mode',
      category: 'Appearance',
      icon: theme === 'light' ? Moon : Sun,
      run: () => {
        toggleTheme();
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'action-card',
      title: 'View Sovereign Digital ID',
      category: 'Identity',
      icon: CreditCard,
      run: () => {
        onNavigate?.('member-card');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'action-signout',
      title: 'Sign Out of Sovereign OS',
      category: 'Account',
      icon: LogOut,
      run: () => {
        setIsCommandPaletteOpen(false);
        logout();
      },
    },
  ].filter((a) => {
    if (!paletteQuery.trim()) return true;
    return a.title.toLowerCase().includes(paletteQuery.toLowerCase());
  });

  const totalPaletteItems = matchingTabs.length + memberResults.length + actions.length;

  const handleKeyDownPalette = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (totalPaletteItems > 0 ? (prev + 1) % totalPaletteItems : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (totalPaletteItems > 0 ? (prev - 1 + totalPaletteItems) % totalPaletteItems : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeSelectedItem();
    }
  };

  const executeSelectedItem = () => {
    let index = selectedIndex;

    // Check tabs
    if (index < matchingTabs.length) {
      const [key] = matchingTabs[index];
      onNavigate?.(key);
      setIsCommandPaletteOpen(false);
      return;
    }
    index -= matchingTabs.length;

    // Check members
    if (index < memberResults.length) {
      onNavigate?.('admin-members');
      setIsCommandPaletteOpen(false);
      return;
    }
    index -= memberResults.length;

    // Check actions
    if (index < actions.length) {
      actions[index].run();
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      <header className="topbar">
        {/* 1. Left: Dynamic Spatial Breadcrumbs */}
        <div className="topbar-left">
          <div className="topbar-breadcrumb">
            <div style={{ position: 'relative' }} ref={portalDropdownRef}>
              <button
                type="button"
                className="topbar-portal-chip"
                onClick={() => availablePortals.length > 1 && setShowPortalDropdown((prev) => !prev)}
                title={availablePortals.length > 1 ? `Current Portal: ${currentPortalInfo.label} (Click to switch)` : `Current Portal: ${currentPortalInfo.label}`}
                style={{
                  cursor: availablePortals.length > 1 ? 'pointer' : 'default',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  background: 'rgba(212, 175, 55, 0.1)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <PortalIcon size={14} className="portal-chip-icon" />
                <span className="portal-chip-text">{currentPortalInfo.label}</span>
                {availablePortals.length > 1 && (
                  <ChevronDown
                    size={12}
                    style={{
                      opacity: 0.7,
                      transform: showPortalDropdown ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s',
                    }}
                  />
                )}
              </button>

              {showPortalDropdown && availablePortals.length > 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    minWidth: '220px',
                    background: 'var(--bg-card, #121214)',
                    border: '1px solid var(--border-color, rgba(212, 175, 55, 0.25))',
                    borderRadius: '10px',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
                    padding: '6px',
                    zIndex: 1000,
                  }}
                >
                  <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', padding: '6px 10px', fontWeight: 700 }}>
                    Switch Portal View
                  </div>
                  {availablePortals.map((p) => {
                    const isCurrent = activePortal === p.key;
                    const ItemIcon = p.icon;
                    return (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => {
                          setActivePortal(p.key);
                          setShowPortalDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '10px',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: 'none',
                          background: isCurrent ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                          color: isCurrent ? 'var(--text-gold, #d4af37)' : 'var(--text-main, #fff)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <ItemIcon size={14} />
                          <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{p.label}</div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{p.desc}</div>
                          </div>
                        </div>
                        {isCurrent && <Check size={14} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current-tab">{currentTabInfo.title}</span>
          </div>
        </div>

        {/* 2. Center: State-of-the-Art Command Search Trigger */}
        <div className="topbar-center">
          <button
            type="button"
            className="topbar-search-trigger"
            onClick={() => setIsCommandPaletteOpen(true)}
            aria-label="Open command palette"
          >
            <div className="search-trigger-content">
              <Search size={14} className="search-trigger-icon" />
              <span className="search-trigger-placeholder">
                Search members, records, actions...
              </span>
            </div>
            <kbd className="topbar-kbd">
              <span className="kbd-sym">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* 3. Right: Modern Action Cluster */}
        <div className="topbar-right">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className={`topbar-action-btn ${showNotifications ? 'active' : ''}`}
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && <span className="notification-pulse-dot" />}
            </button>

            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notif-header">
                  <div className="notif-header-left">
                    <span className="notif-title">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="notif-badge">{unreadCount} new</span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="notif-mark-read-btn"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="notif-list">
                  {notifications.length === 0 ? (
                    <div className="notif-empty">
                      <Sparkles size={24} className="notif-empty-icon" />
                      <div className="notif-empty-text">All caught up</div>
                      <div className="notif-empty-sub">No unread alerts or council dispatches</div>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`notif-item ${n.isRead ? 'read' : 'unread'}`}
                      >
                        <div className="notif-item-body">
                          <div className="notif-item-title">{n.title}</div>
                          <div className="notif-item-desc">{n.message}</div>
                        </div>
                        {!n.isRead && <span className="notif-unread-dot" />}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className={`topbar-user-pill ${showRoleDropdown ? 'open' : ''}`}
              title={`${user?.firstName} ${user?.lastName} • ${userRoleTitle}`}
              aria-label="User account menu"
            >
              <div className="user-avatar-wrapper">
                <Avatar
                  firstName={user?.firstName}
                  lastName={user?.lastName}
                  size={26}
                />
                <span className="user-online-dot" />
              </div>
              <span className="topbar-user-name">
                {user?.firstName || 'Brother'}
              </span>
              <span className="topbar-role-badge">
                {userRoleBadge}
              </span>
              <ChevronDown
                size={13}
                className={`topbar-chevron ${showRoleDropdown ? 'rotated' : ''}`}
              />
            </button>

            {showRoleDropdown && (
              <div className="role-dropdown-menu">
                <div className="role-dropdown-user-header">
                  <Avatar
                    firstName={user?.firstName}
                    lastName={user?.lastName}
                    size={38}
                  />
                  <div className="user-header-details">
                    <div className="user-header-name">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="user-header-role">
                      ✦ {userRoleTitle}
                    </div>
                    <div className="user-header-email">
                      {user?.email}
                    </div>
                  </div>
                </div>

                {availablePortals.length > 1 && (
                  <>
                    <div className="role-dropdown-section-title">
                      Active Portal Mode
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', padding: '0 10px 10px 10px' }}>
                      {availablePortals.map((p) => {
                        const isCurrent = activePortal === p.key;
                        const ItemIcon = p.icon;
                        return (
                          <button
                            key={p.key}
                            type="button"
                            onClick={() => {
                              setActivePortal(p.key);
                              setShowRoleDropdown(false);
                            }}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              padding: '8px 6px',
                              borderRadius: '8px',
                              border: isCurrent ? '1px solid var(--text-gold, #d4af37)' : '1px solid var(--border-color, rgba(255,255,255,0.08))',
                              background: isCurrent ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                              color: isCurrent ? 'var(--text-gold, #d4af37)' : 'var(--text-main, #fff)',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              textAlign: 'center',
                            }}
                          >
                            <ItemIcon size={14} />
                            <span>{p.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                <div className="role-dropdown-section-title">
                  Quick Switch Persona
                </div>

                <div className="role-switch-list">
                  {demoAccounts.map((acc) => {
                    const isActive = user?.email === acc.email;
                    return (
                      <button
                        key={acc.email}
                        type="button"
                        onClick={() => {
                          quickSwitchUser(acc.email);
                          setShowRoleDropdown(false);
                        }}
                        className={`role-dropdown-item ${isActive ? 'active' : ''}`}
                      >
                        <div className="persona-info">
                          <div className="persona-label">{acc.label}</div>
                          <div className="persona-name">{acc.name}</div>
                        </div>
                        {isActive && <Check size={14} className="persona-check-icon" />}
                      </button>
                    );
                  })}
                </div>

                <div className="role-dropdown-footer">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRoleDropdown(false);
                      logout();
                    }}
                    className="role-dropdown-signout"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 4. Sovereign Spotlight Command Palette Modal */}
      {isCommandPaletteOpen && (
        <div
          className="command-palette-backdrop"
          onClick={() => setIsCommandPaletteOpen(false)}
        >
          <div
            className="command-palette-modal"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDownPalette}
          >
            {/* Search Input Bar */}
            <div className="palette-input-wrap">
              <Search size={18} className="palette-search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                className="palette-input"
                placeholder="Jump to section, search members, run action..."
                value={paletteQuery}
                onChange={(e) => {
                  setPaletteQuery(e.target.value);
                  setSelectedIndex(0);
                }}
              />
              <button
                type="button"
                className="palette-close-btn"
                onClick={() => setIsCommandPaletteOpen(false)}
                title="Close"
              >
                <kbd className="palette-esc-kbd">ESC</kbd>
              </button>
            </div>

            {/* Results Body */}
            <div className="palette-results-container">
              {/* Navigation Items */}
              {matchingTabs.length > 0 && (
                <div className="palette-section">
                  <div className="palette-section-title">Navigation & Portals</div>
                  {matchingTabs.map(([key, item], idx) => {
                    const isSelected = selectedIndex === idx;
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={key}
                        type="button"
                        className={`palette-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          onNavigate?.(key);
                          setIsCommandPaletteOpen(false);
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                      >
                        <div className="palette-item-left">
                          <span className="palette-item-icon-box">
                            <ItemIcon size={15} />
                          </span>
                          <span className="palette-item-title">{item.title}</span>
                          <span className="palette-item-badge">{item.category}</span>
                        </div>
                        <span className="palette-item-hint">Jump ↵</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Live Member Search Results */}
              {memberResults.length > 0 && (
                <div className="palette-section">
                  <div className="palette-section-title">Members Found</div>
                  {memberResults.map((m, idx) => {
                    const adjustedIdx = matchingTabs.length + idx;
                    const isSelected = selectedIndex === adjustedIdx;
                    return (
                      <button
                        key={m.id || idx}
                        type="button"
                        className={`palette-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          onNavigate?.('admin-members');
                          setIsCommandPaletteOpen(false);
                        }}
                        onMouseEnter={() => setSelectedIndex(adjustedIdx)}
                      >
                        <div className="palette-item-left">
                          <Avatar
                            firstName={m.user?.firstName || m.firstName}
                            lastName={m.user?.lastName || m.lastName}
                            size={24}
                          />
                          <div className="palette-member-meta">
                            <span className="palette-item-title">
                              {m.user?.firstName || m.firstName} {m.user?.lastName || m.lastName}
                            </span>
                            <span className="palette-member-code">{m.memberCode}</span>
                          </div>
                        </div>
                        <span className="palette-member-tag">
                          {m.type?.name || 'Member'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Actions */}
              {actions.length > 0 && (
                <div className="palette-section">
                  <div className="palette-section-title">Actions & Tools</div>
                  {actions.map((action, idx) => {
                    const adjustedIdx = matchingTabs.length + memberResults.length + idx;
                    const isSelected = selectedIndex === adjustedIdx;
                    const ActionIcon = action.icon;
                    return (
                      <button
                        key={action.id}
                        type="button"
                        className={`palette-item ${isSelected ? 'selected' : ''}`}
                        onClick={action.run}
                        onMouseEnter={() => setSelectedIndex(adjustedIdx)}
                      >
                        <div className="palette-item-left">
                          <span className="palette-item-icon-box action">
                            <ActionIcon size={15} />
                          </span>
                          <span className="palette-item-title">{action.title}</span>
                        </div>
                        <span className="palette-item-hint">Execute ↵</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {totalPaletteItems === 0 && (
                <div className="palette-empty-state">
                  <Search size={24} className="palette-empty-icon" />
                  <div className="palette-empty-text">No matches found for "{paletteQuery}"</div>
                  <div className="palette-empty-sub">Try searching for members, sections, or commands</div>
                </div>
              )}
            </div>

            {/* Footer shortcuts */}
            <div className="palette-footer">
              <div className="palette-footer-shortcut">
                <kbd>↑</kbd> <kbd>↓</kbd> <span>to navigate</span>
              </div>
              <div className="palette-footer-shortcut">
                <kbd>↵</kbd> <span>to select</span>
              </div>
              <div className="palette-footer-shortcut">
                <kbd>esc</kbd> <span>to dismiss</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopNav;
