import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { DemoRoleBar } from './components/layout/DemoRoleBar.js';
import { Sidebar } from './components/layout/Sidebar.js';
import { TopNav } from './components/layout/TopNav.js';

// Portals
import { PublicInductionPage } from './portals/public/PublicInductionPage.js';
import { MemberHome } from './portals/member/MemberHome.js';
import { MemberCardView } from './portals/member/MemberCardView.js';
import { MemberEventsView } from './portals/member/MemberEventsView.js';
import { MemberLearningView } from './portals/member/MemberLearningView.js';
import { MemberMentorshipView } from './portals/member/MemberMentorshipView.js';
import { MemberFitnessView } from './portals/member/MemberFitnessView.js';
import { MemberBusinessView } from './portals/member/MemberBusinessView.js';
import { MemberServiceView } from './portals/member/MemberServiceView.js';
import { MemberCommunityView } from './portals/member/MemberCommunityView.js';
import { MemberProfileView } from './portals/member/MemberProfileView.js';

import { AdminDashboardView } from './portals/admin/AdminDashboardView.js';
import { AdminMembersView } from './portals/admin/AdminMembersView.js';
import { AdminApplicationsView } from './portals/admin/AdminApplicationsView.js';
import { AdminEventsView } from './portals/admin/AdminEventsView.js';
import { AdminIntegrationsView } from './portals/admin/AdminIntegrationsView.js';
import { AdminAuditView } from './portals/admin/AdminAuditView.js';

import { MentorDashboardView } from './portals/mentor/MentorDashboardView.js';
import { OrganizerDashboardView } from './portals/organizer/OrganizerDashboardView.js';
import { FinanceDashboardView } from './portals/finance/FinanceDashboardView.js';

const MainLayout: React.FC = () => {
  const { user, activePortal } = useAuth();
  const [currentTab, setCurrentTab] = useState('member-home');

  // Automatically adapt default tab when portal changes
  useEffect(() => {
    switch (activePortal) {
      case 'ADMIN':
        setCurrentTab('admin-dashboard');
        break;
      case 'MENTOR':
        setCurrentTab('mentor-mentees');
        break;
      case 'ORGANIZER':
        setCurrentTab('organizer-checkin');
        break;
      case 'FINANCE':
        setCurrentTab('finance-overview');
        break;
      case 'MEMBER':
      default:
        setCurrentTab('member-home');
        break;
    }
  }, [activePortal]);

  const renderContent = () => {
    switch (currentTab) {
      // Member Portal
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
      case 'member-service':
        return <MemberServiceView />;
      case 'member-community':
        return <MemberCommunityView />;
      case 'member-profile':
        return <MemberProfileView />;

      // Admin Portal
      case 'admin-dashboard':
        return <AdminDashboardView onNavigate={setCurrentTab} />;
      case 'admin-members':
        return <AdminMembersView />;
      case 'admin-applications':
        return <AdminApplicationsView />;
      case 'admin-events':
        return <AdminEventsView />;
      case 'admin-finance':
        return <FinanceDashboardView />;
      case 'admin-integrations':
        return <AdminIntegrationsView />;
      case 'admin-audit':
        return <AdminAuditView />;

      // Mentor Portal
      case 'mentor-mentees':
      case 'mentor-sessions':
        return <MentorDashboardView />;

      // Organizer Portal
      case 'organizer-events':
      case 'organizer-checkin':
        return <OrganizerDashboardView />;

      // Finance Portal
      case 'finance-overview':
      case 'finance-ledger':
        return <FinanceDashboardView />;

      default:
        return <MemberHome onNavigate={setCurrentTab} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <div className="main-wrapper">
        <DemoRoleBar />
        <TopNav />
        <main className="content-body">{renderContent()}</main>
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
    return <PublicInductionPage onSuccess={refreshUser} />;
  }

  return <MainLayout />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
