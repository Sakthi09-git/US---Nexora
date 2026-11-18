import React from 'react';
import { 
  Home, 
  CheckCircle2, 
  Smartphone, 
  GraduationCap, 
  UserCircle 
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { useApp } from '../../context/AppContext';

interface MobileNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  const { getDailyStats } = useApp();
  const stats = getDailyStats();

  const mobileTabs = [
    { id: 'dashboard' as NavTab, label: 'Home', icon: Home },
    { id: 'my-habits' as NavTab, label: 'Habits', icon: CheckCircle2, badge: stats.pendingActivities > 0 ? stats.pendingActivities : undefined },
    { id: 'screen-time' as NavTab, label: 'Screen', icon: Smartphone },
    { id: 'career-growth' as NavTab, label: 'Growth', icon: GraduationCap },
    { id: 'settings' as NavTab, label: 'Profile', icon: UserCircle },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/80 px-2 pt-2 pb-[max(env(safe-area-inset-bottom,0px),0.75rem)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {mobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id || (tab.id === 'my-habits' && currentTab === 'shared-habits');
          
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                isActive ? 'text-indigo-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-105 text-indigo-400' : 'text-zinc-400'}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-indigo-500 text-white text-[9px] font-bold">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-indigo-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

