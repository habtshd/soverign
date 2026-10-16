import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { ThemeProvider } from './context/ThemeContext.js';
import { Sidebar } from './components/layout/Sidebar.js';
import { TopNav } from './components/layout/TopNav.js';
import { ErrorBoundary } from './components/common/ErrorBoundary.js';

// Portals
import { SovereignLandingPage } from './portals/landing/SovereignLandingPage.js';
import { PublicInductionPage } from './portals/public/PublicInductionPage.js';

// 1. Member Portal Views
import { MemberHome } from './portals/member/MemberHome.js';
import { MemberCardView } from './portals/member/MemberCardView.js';
import { MemberEventsView } from './portals/member/MemberEventsView.js';
import { MemberLearningView } from './portals/member/MemberLearningView.js';
import { MemberMentorshipView } from './portals/member/MemberMentorshipView.js';
import { MemberFitnessView } from './portals/member/MemberFitnessView.js';
import { MemberBusinessView } from './portals/member/MemberBusinessView.js';
import { MemberCareerView } from './portals/member/MemberCareerView.js';
import { MemberServiceView } from './portals/member/MemberServiceView.js';
import { MemberCommunityView } from './portals/member/MemberCommunityView.js';
import { MemberProfileView } from './portals/member/MemberProfileView.js';

// 2. Mentor Portal Views
import { MentorDashboardView } from './portals/mentor/MentorDashboardView.js';

// 3. Leader / Organizer Portal Views
import { OrganizerDashboardView } from './portals/organizer/OrganizerDashboardView.js';

// 4. Admin Portal Views
import { AdminDashboardView } from './portals/admin/AdminDashboardView.js';
import { AdminMembersView } from './portals/admin/AdminMembersView.js';
import { AdminApplicationsView } from './portals/admin/AdminApplicationsView.js';
import { AdminRolesView } from './portals/admin/AdminRolesView.js';
import { AdminEventsView } from './portals/admin/AdminEventsView.js';
import { AdminContentView } from './portals/admin/AdminContentView.js';
import { AdminFinanceView } from './portals/admin/AdminFinanceView.js';
import { AdminReportsView } from './portals/admin/AdminReportsView.js';
import { AdminIntegrationsView } from './portals/admin/AdminIntegrationsView.js';
import { AdminAuditView } from './portals/admin/AdminAuditView.js';
import { AdminSettingsView } from './portals/admin/AdminSettingsView.js';

const PORTAL_TABS: Record<string, string[]> = {
  ADMIN: [
    'admin-dashboard',
    'admin-members',
    'admin-applications',
    'admin-roles',
    'admin-events',
    'admin-content',
    'admin-finance',
    'admin-reports',
    'admin-integrations',
    'admin-audit',
    'admin-settings',
  ],
  MEMBER: [
    'member-home',
    'member-card',
    'member-events',
    'member-learning',
    'member-mentorship',
    'member-fitness',
    'member-business',
    'member-career',
    'member-service',
    'member-community',
    'member-profile',
  ],
  MENTOR: [
    'mentor-mentees',
    'mentor-matching',
    'mentor-sessions',
    'mentor-notes',
    'mentor-goals',
    'mentor-communication',
    'mentor-reports',
  ],
  ORGANIZER: [
    'organizer-dashboard',
    'organizer-programs',
    'organizer-events',
    'organizer-checkin',
    'organizer-challenges',
    'organizer-projects',
    'organizer-team',
    'organizer-reports',
  ],
};

const DEFAULT_PORTAL_TABS: Record<string, string> = {
  ADMIN: 'admin-dashboard',
  MEMBER: 'member-home',
  MENTOR: 'mentor-mentees',
  ORGANIZER: 'organizer-dashboard',
};

const MainLayout: React.FC = () => {
  const { user, activePortal } = useAuth();

  const getInitialTab = (): string => {
    const saved = localStorage.getItem('sovereign_current_tab');
    if (saved && PORTAL_TABS[activePortal]?.includes(saved)) {
      return saved;
    }
    return DEFAULT_PORTAL_TABS[activePortal] || 'member-home';
  };

  const [currentTab, setCurrentTabState] = useState<string>(getInitialTab);

  const setCurrentTab = (tab: string) => {
    localStorage.setItem('sovereign_current_tab', tab);
    setCurrentTabState(tab);
  };

  // Automatically adapt default tab when portal changes
  useEffect(() => {
    const saved = localStorage.getItem('sovereign_current_tab');
    if (saved && PORTAL_TABS[activePortal]?.includes(saved)) {
      setCurrentTabState(saved);
    } else {
      const defaultTab = DEFAULT_PORTAL_TABS[activePortal] || 'member-home';
      setCurrentTabState(defaultTab);
      localStorage.setItem('sovereign_current_tab', defaultTab);
    }
  }, [activePortal]);

  const renderContent = () => {
    switch (currentTab) {
      // 1. MEMBER PORTAL
      case 'member-home':
        return <MemberHome onNavigate={setCurrentTab} />;
      case 'member-card':
        return <MemberCardView />;
      case 'member-events':
        return <MemberEventsView />;
      case 'member-learning':
        return <MemberLearningView />;
      case 'member-mentorship':
        return <MemberMentorshipView />;
      case 'member-fitness':
        return <MemberFitnessView />;
      case 'member-business':
        return <MemberBusinessView />;
      case 'member-career':
        return <MemberCareerView />;
      case 'member-service':
        return <MemberServiceView />;
      case 'member-community':
        return <MemberCommunityView />;
      case 'member-profile':
        return <MemberProfileView />;

      // 2. MENTOR PORTAL
      case 'mentor-mentees':
      case 'mentor-matching':
      case 'mentor-sessions':
      case 'mentor-notes':
      case 'mentor-goals':
      case 'mentor-communication':
      case 'mentor-reports':
        return <MentorDashboardView />;

      // 3. LEADER / ORGANIZER PORTAL
      case 'organizer-dashboard':
      case 'organizer-programs':
      case 'organizer-events':
      case 'organizer-checkin':
      case 'organizer-challenges':
      case 'organizer-projects':
      case 'organizer-team':
      case 'organizer-reports':
        return <OrganizerDashboardView />;

      // 4. ADMIN PORTAL
      case 'admin-dashboard':
        return <AdminDashboardView onNavigate={setCurrentTab} />;
      case 'admin-members':
        return <AdminMembersView />;
      case 'admin-applications':
        return <AdminApplicationsView />;
      case 'admin-roles':
        return <AdminRolesView />;
      case 'admin-events':
        return <AdminEventsView />;
      case 'admin-content':
        return <AdminContentView />;
      case 'admin-finance':
        return <AdminFinanceView />;
      case 'admin-reports':
        return <AdminReportsView />;
      case 'admin-integrations':
        return <AdminIntegrationsView />;
      case 'admin-audit':
        return <AdminAuditView />;
      case 'admin-settings':
        return <AdminSettingsView />;

      default:
        return <MemberHome onNavigate={setCurrentTab} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <div className="main-wrapper">
        <TopNav currentTab={currentTab} onNavigate={setCurrentTab} />
        <main className="content-body">
          <ErrorBoundary onReset={() => setCurrentTab('member-home')}>
            {renderContent()}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export const AppContent: React.FC = () => {
  const { user, isLoading, refreshUser } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary)',
          color: 'var(--text-gold)',
          fontFamily: 'var(--font-serif)',
          fontSize: '1.2rem',
          letterSpacing: '0.1em',
        }}
      >
        INITIALIZING SOVEREIGN OPERATING SYSTEM...
      </div>
    );
  }

  if (!user) {
    return <SovereignLandingPage onSuccess={() => refreshUser()} />;
  }

  return <MainLayout />;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
