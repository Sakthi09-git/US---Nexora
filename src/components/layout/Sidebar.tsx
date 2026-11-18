import React from 'react';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Users2, 
  Smartphone, 
  GraduationCap, 
  BarChart3, 
  Award, 
  CalendarRange, 
  Settings,
  ShieldCheck,
  Heart,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type NavTab = 
  | 'dashboard'
  | 'my-habits'
  | 'shared-habits'
  | 'screen-time'
  | 'career-growth'
  | 'analytics'
  | 'achievements'
  | 'monthly-cycles'
  | 'settings'
  | 'admin-portal';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const { currentUser, partnerUser, isConnectedWithPartner, getDailyStats } = useApp();
  const stats = getDailyStats();

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-habits' as NavTab, label: 'My Habits', icon: CheckCircle2, badge: stats.pendingActivities > 0 ? `${stats.pendingActivities}` : undefined },
    { id: 'shared-habits' as NavTab, label: 'Shared Habits', icon: Users2, partnerOnly: true },
    { id: 'screen-time' as NavTab, label: 'Screen Time', icon: Smartphone },
    { id: 'career-growth' as NavTab, label: 'Career Growth', icon: GraduationCap },
    { id: 'analytics' as NavTab, label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'achievements' as NavTab, label: 'Achievements', icon: Award },
    { id: 'monthly-cycles' as NavTab, label: 'Monthly Cycles', icon: CalendarRange },
    ...(currentUser?.role === 'admin' ? [{ id: 'admin-portal' as NavTab, label: 'Admin Portal', icon: ShieldCheck }] : []),
    { id: 'settings' as NavTab, label: 'Settings & Partner', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 glass-panel border-r border-white/[0.08] min-h-[calc(100vh-61px)] p-4 justify-between">
      <div className="space-y-6">
        
        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Partner or Solo Workspace Summary */}
      <div className="pt-4 border-t border-white/[0.06] space-y-3">
        {isConnectedWithPartner && partnerUser ? (
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400 font-medium">Couple Synergy</span>
              <span className="text-emerald-400 font-bold">{stats.couplePercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${stats.couplePercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
              <span>You: {stats.individualPercent}%</span>
              <span>{partnerUser.full_name.split(' ')[0]}: {stats.partnerPercent}%</span>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 font-medium">Personal Progress</span>
              <span className="text-indigo-400 font-bold">{stats.individualPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.individualPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 mt-1.5">
              Solo personal workspace active
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 px-2 text-[11px] text-slate-500">
          <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/20" />
          <span>Growing together every month</span>
        </div>
      </div>
    </aside>
  );
};
