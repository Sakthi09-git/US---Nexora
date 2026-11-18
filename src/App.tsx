import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { HabitsView } from './components/habits/HabitsView';
import { ScreenTimeView } from './components/screentime/ScreenTimeView';
import { CareerGrowthView } from './components/career/CareerGrowthView';
import { MonthlyCyclesView } from './components/monthly/MonthlyCyclesView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { AchievementsView } from './components/achievements/AchievementsView';
import { SettingsView } from './components/settings/SettingsView';
import { AdminPortalView } from './components/admin/AdminPortalView';
import { LoginPage } from './components/auth/LoginPage';

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Handle URL join parameter if someone visits ?join=CODE or ?joinUser=ID
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get('join') || params.get('joinUser');
    if (joinCode) {
      setCurrentTab('settings');
    }
  }, []);

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView onNavigateToTab={setCurrentTab} />;
      case 'my-habits':
        return <HabitsView initialScope="my" />;
      case 'shared-habits':
        return <HabitsView initialScope="shared" />;
      case 'screen-time':
        return <ScreenTimeView />;
      case 'career-growth':
        return <CareerGrowthView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'achievements':
        return <AchievementsView />;
      case 'monthly-cycles':
        return <MonthlyCyclesView />;
      case 'settings':
        return <SettingsView />;
      case 'admin-portal':
        return <AdminPortalView />;
      default:
        return <DashboardView onNavigateToTab={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Header Navbar */}
      <Navbar />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Desktop Sidebar */}
        <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

        {/* Content View */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 max-w-5xl w-full mx-auto pb-[calc(max(env(safe-area-inset-bottom,0px),1rem)+5rem)] lg:pb-8">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav currentTab={currentTab} onSelectTab={setCurrentTab} />
    </div>
  );
};

const MainApp: React.FC = () => {
  const { currentUser, connectByInviteCode } = useApp();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const joinCode = params.get('join') || params.get('joinUser');
      if (joinCode) {
        sessionStorage.setItem('nexora_pending_join', joinCode.toUpperCase());
        if (currentUser && !currentUser.partner_id) {
          connectByInviteCode(joinCode);
        }
      }
    } catch {
      // Ignore
    }
  }, [currentUser]);

  if (!currentUser) {
    return <LoginPage />;
  }

  return <MainLayout />;
};

export function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;
