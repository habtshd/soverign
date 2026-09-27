import React from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { Avatar } from '../common/Avatar.js';
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
  Award,
  Layers,
  Settings,
  Key,
  BarChart2,
  CheckSquare,
  UserCheck,
  Send,
  TrendingUp,
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
            <div className="nav-section-title">Admin</div>
            <button
              className={`nav-item ${currentTab === 'admin-dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin-dashboard')}
            >
              <LayoutDashboard className="nav-item-icon" />
              <span>Dashboard</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'admin-members' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin-members')}
            >
              <Users className="nav-item-icon" />
              <span>Members</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'admin-applications' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin-applications')}
            >
              <FileText className="nav-item-icon" />
              <span>Applications</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'admin-roles' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin-roles')}
            >
              <Key className="nav-item-icon" />
              <span>Roles</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'admin-events' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin-events')}
            >
              <Calendar className="nav-item-icon" />
              <span>Events</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'admin-content' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin-content')}
            >
              <BookOpen className="nav-item-icon" />
              <span>Content</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'admin-finance' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin-finance')}
            >
              <DollarSign className="nav-item-icon" />
              <span>Finance</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'admin-reports' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin-reports')}
            >
              <TrendingUp className="nav-item-icon" />
              <span>Reports</span>
            </button>

            <div className="nav-section-title">System</div>
            <button
              className={`nav-item ${currentTab === 'admin-integrations' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin-integrations')}
            >
              <Workflow className="nav-item-icon" />
              <span>Integrations</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'admin-audit' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin-audit')}
            >
              <Lock className="nav-item-icon" />
              <span>Security</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'admin-settings' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin-settings')}
            >
              <Settings className="nav-item-icon" />
              <span>Settings</span>
            </button>
          </>
        );

      case 'MENTOR':
        return (
          <>
            <div className="nav-section-title">Mentor</div>
            <button
              className={`nav-item ${currentTab === 'mentor-mentees' ? 'active' : ''}`}
              onClick={() => setCurrentTab('mentor-mentees')}
            >
              <Users className="nav-item-icon" />
              <span>Mentees</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'mentor-matching' ? 'active' : ''}`}
              onClick={() => setCurrentTab('mentor-matching')}
            >
              <UserCheck className="nav-item-icon" />
              <span>Matching</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'mentor-sessions' ? 'active' : ''}`}
              onClick={() => setCurrentTab('mentor-sessions')}
            >
              <Calendar className="nav-item-icon" />
              <span>Sessions</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'mentor-goals' ? 'active' : ''}`}
              onClick={() => setCurrentTab('mentor-goals')}
            >
              <CheckSquare className="nav-item-icon" />
              <span>Goals</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'mentor-communication' ? 'active' : ''}`}
              onClick={() => setCurrentTab('mentor-communication')}
            >
              <MessageSquare className="nav-item-icon" />
              <span>Messages</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'mentor-reports' ? 'active' : ''}`}
              onClick={() => setCurrentTab('mentor-reports')}
            >
              <FileText className="nav-item-icon" />
              <span>Reports</span>
            </button>
          </>
        );

      case 'ORGANIZER':
        return (
          <>
            <div className="nav-section-title">Operations</div>
            <button
              className={`nav-item ${currentTab === 'organizer-dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentTab('organizer-dashboard')}
            >
              <BarChart2 className="nav-item-icon" />
              <span>Overview</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'organizer-programs' ? 'active' : ''}`}
              onClick={() => setCurrentTab('organizer-programs')}
            >
              <Layers className="nav-item-icon" />
              <span>Programs</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'organizer-events' ? 'active' : ''}`}
              onClick={() => setCurrentTab('organizer-events')}
            >
              <Calendar className="nav-item-icon" />
              <span>Events</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'organizer-checkin' ? 'active' : ''}`}
              onClick={() => setCurrentTab('organizer-checkin')}
            >
              <QrCode className="nav-item-icon" />
              <span>Check-in</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'organizer-challenges' ? 'active' : ''}`}
              onClick={() => setCurrentTab('organizer-challenges')}
            >
              <Award className="nav-item-icon" />
              <span>Challenges</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'organizer-projects' ? 'active' : ''}`}
              onClick={() => setCurrentTab('organizer-projects')}
            >
              <HeartHandshake className="nav-item-icon" />
              <span>Projects</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'organizer-team' ? 'active' : ''}`}
              onClick={() => setCurrentTab('organizer-team')}
            >
              <Users className="nav-item-icon" />
              <span>Team</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'organizer-reports' ? 'active' : ''}`}
              onClick={() => setCurrentTab('organizer-reports')}
            >
              <TrendingUp className="nav-item-icon" />
              <span>Reports</span>
            </button>
          </>
        );

      case 'MEMBER':
      default:
        return (
          <>
            <div className="nav-section-title">Brotherhood</div>
            <button
              className={`nav-item ${currentTab === 'member-home' ? 'active' : ''}`}
              onClick={() => setCurrentTab('member-home')}
            >
              <Home className="nav-item-icon" />
              <span>Overview</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'member-card' ? 'active' : ''}`}
              onClick={() => setCurrentTab('member-card')}
            >
              <CreditCard className="nav-item-icon" />
              <span>Card</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'member-events' ? 'active' : ''}`}
              onClick={() => setCurrentTab('member-events')}
            >
              <Calendar className="nav-item-icon" />
              <span>Events</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'member-learning' ? 'active' : ''}`}
              onClick={() => setCurrentTab('member-learning')}
            >
              <BookOpen className="nav-item-icon" />
              <span>Academy</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'member-fitness' ? 'active' : ''}`}
              onClick={() => setCurrentTab('member-fitness')}
            >
              <Activity className="nav-item-icon" />
              <span>Fitness</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'member-business' ? 'active' : ''}`}
              onClick={() => setCurrentTab('member-business')}
            >
              <DollarSign className="nav-item-icon" />
              <span>Business</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'member-career' ? 'active' : ''}`}
              onClick={() => setCurrentTab('member-career')}
            >
              <Briefcase className="nav-item-icon" />
              <span>Career</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'member-mentorship' ? 'active' : ''}`}
              onClick={() => setCurrentTab('member-mentorship')}
            >
              <Compass className="nav-item-icon" />
              <span>Mentorship</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'member-service' ? 'active' : ''}`}
              onClick={() => setCurrentTab('member-service')}
            >
              <HeartHandshake className="nav-item-icon" />
              <span>Service</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'member-community' ? 'active' : ''}`}
              onClick={() => setCurrentTab('member-community')}
            >
              <MessageSquare className="nav-item-icon" />
              <span>Community</span>
            </button>
            <button
              className={`nav-item ${currentTab === 'member-profile' ? 'active' : ''}`}
              onClick={() => setCurrentTab('member-profile')}
            >
              <User className="nav-item-icon" />
              <span>Profile</span>
            </button>
          </>
        );
    }
  };

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div
        className="sidebar-header"
        onClick={() => setCurrentTab(activePortal === 'ADMIN' ? 'admin-dashboard' : 'member-home')}
        title="Return to Home Dashboard"
      >
        <div className="brand-crest">
          <img src="/logo.png" alt="Sovereign Men's Club" className="logo-dark" />
          <img src="/logo-light.png" alt="Sovereign Men's Club" className="logo-light" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">{renderNavItems()}</nav>

      {/* User Footer Profile */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <Avatar
            firstName={user?.firstName}
            lastName={user?.lastName}
            size={34}
          />
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">
              {user ? `${user.firstName} ${user.lastName}` : 'Guest Brother'}
            </div>
            <div className="sidebar-user-role">
              {user?.memberNumber || user?.roles?.[0] || 'VERIFIED'}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="btn-icon"
          title="Sign Out"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};
