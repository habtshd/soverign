import React from 'react';
import { useAuth } from '../../context/AuthContext.js';
import {
  Shield,
  Home,
  CreditCard,
  Calendar,
  BookOpen,
  Compass,
  Activity,
  Briefcase,
  HeartHandshake,
  MessageSquare,
  User,
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  Workflow,
  Lock,
  QrCode,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, activePortal, logout } = useAuth();

  const renderNavItems = () => {
    switch (activePortal) {
      case 'ADMIN':
        return (
          <>
            <div className="nav-section-title">Executive Command</div>
            <button
              className={`nav-item ${currentTab === 'admin-dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin-dashboard')}
            >
              <LayoutDashboard className="nav-item-icon" />
              <span>Executive Dashboard</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'admin-members' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin-members')}
            >
              <Users className="nav-item-icon" />
              <span>Member Directory</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'admin-applications' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin-applications')}
            >
              <FileText className="nav-item-icon" />
              <span>Applications & Intake</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'admin-events' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin-events')}
            >
              <Calendar className="nav-item-icon" />
              <span>Event Operations</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'admin-finance' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin-finance')}
            >
              <DollarSign className="nav-item-icon" />
              <span>Treasury & Ledger</span>
            </button>

            <div className="nav-section-title">Systems & Governance</div>
            <button
              className={`nav-item ${currentTab === 'admin-integrations' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin-integrations')}
            >
              <Workflow className="nav-item-icon" />
              <span>Google & Telegram Sync</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'admin-audit' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin-audit')}
            >
              <Lock className="nav-item-icon" />
              <span>Security & Audit Trail</span>
            </button>
          </>
        );

      case 'MENTOR':
        return (
          <>
            <div className="nav-section-title">Mentor Command</div>
            <button
              className={`nav-item ${currentTab === 'mentor-mentees' ? 'active' : ''}`}
              onClick={() => setCurrentTab('mentor-mentees')}
            >
              <Users className="nav-item-icon" />
              <span>Assigned Mentees</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'mentor-sessions' ? 'active' : ''}`}
              onClick={() => setCurrentTab('mentor-sessions')}
            >
              <Calendar className="nav-item-icon" />
              <span>Mentorship Sessions</span>
            </button>
          </>
        );

      case 'ORGANIZER':
        return (
          <>
            <div className="nav-section-title">Organizer Command</div>
            <button
              className={`nav-item ${currentTab === 'organizer-events' ? 'active' : ''}`}
              onClick={() => setCurrentTab('organizer-events')}
            >
              <Calendar className="nav-item-icon" />
              <span>Manage Events</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'organizer-checkin' ? 'active' : ''}`}
              onClick={() => setCurrentTab('organizer-checkin')}
            >
              <QrCode className="nav-item-icon" />
              <span>QR Attendance Scanner</span>
            </button>
          </>
        );

      case 'FINANCE':
        return (
          <>
            <div className="nav-section-title">Financial Control</div>
            <button
              className={`nav-item ${currentTab === 'finance-overview' ? 'active' : ''}`}
              onClick={() => setCurrentTab('finance-overview')}
            >
              <DollarSign className="nav-item-icon" />
              <span>Treasury Overview</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'finance-ledger' ? 'active' : ''}`}
              onClick={() => setCurrentTab('finance-ledger')}
            >
              <FileText className="nav-item-icon" />
              <span>Income & Expenses</span>
            </button>
          </>
        );

      case 'MEMBER':
      default:
        return (
          <>
            <div className="nav-section-title">Brotherhood Hub</div>
            <button
              className={`nav-item ${currentTab === 'member-home' ? 'active' : ''}`}
              onClick={() => setCurrentTab('member-home')}
            >
              <Home className="nav-item-icon" />
              <span>Command Center</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'member-card' ? 'active' : ''}`}
              onClick={() => setCurrentTab('member-card')}
            >
              <CreditCard className="nav-item-icon" />
              <span>Digital Member ID</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'member-events' ? 'active' : ''}`}
              onClick={() => setCurrentTab('member-events')}
            >
              <Calendar className="nav-item-icon" />
              <span>Events & Expeditions</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'member-learning' ? 'active' : ''}`}
              onClick={() => setCurrentTab('member-learning')}
            >
              <BookOpen className="nav-item-icon" />
              <span>Learning & Mastery</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'member-mentorship' ? 'active' : ''}`}
              onClick={() => setCurrentTab('member-mentorship')}
            >
              <Compass className="nav-item-icon" />
              <span>Mentorship Track</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'member-fitness' ? 'active' : ''}`}
              onClick={() => setCurrentTab('member-fitness')}
            >
              <Activity className="nav-item-icon" />
              <span>Fitness & Spartan Protocol</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'member-business' ? 'active' : ''}`}
              onClick={() => setCurrentTab('member-business')}
            >
              <Briefcase className="nav-item-icon" />
              <span>Capital & Opportunities</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'member-service' ? 'active' : ''}`}
              onClick={() => setCurrentTab('member-service')}
            >
              <HeartHandshake className="nav-item-icon" />
              <span>Community Impact</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'member-community' ? 'active' : ''}`}
              onClick={() => setCurrentTab('member-community')}
            >
              <MessageSquare className="nav-item-icon" />
              <span>Brotherhood Feed</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'member-profile' ? 'active' : ''}`}
              onClick={() => setCurrentTab('member-profile')}
            >
              <User className="nav-item-icon" />
              <span>My Profile</span>
            </button>
          </>
        );
    }
  };

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-crest">
          <Shield size={20} color="#0b0d12" />
        </div>
        <div>
          <div className="brand-title">Sovereign</div>
          <div className="brand-subtitle">Men's Club OS</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">{renderNavItems()}</nav>

      {/* User Footer */}
      <div className="sidebar-footer">
        <div className="user-snippet">
          <img
            src={
              user?.avatarUrl ||
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
            }
            alt={user?.firstName || 'User'}
            className="user-avatar"
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#fff',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user ? `${user.firstName} ${user.lastName}` : 'Guest Brother'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-gold)', textTransform: 'uppercase' }}>
              {user?.roles?.[0] || 'GUEST'}
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
            }}
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
