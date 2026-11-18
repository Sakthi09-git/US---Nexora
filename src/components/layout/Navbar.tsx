import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Flame, 
  Sparkles, 
  Users, 
  LogIn, 
  LogOut, 
  UserPlus, 
  Heart, 
  ShieldCheck, 
  UserCircle,
  ChevronDown,
  Smartphone
} from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';
import { PartnerConnectionModal } from '../partner/PartnerConnectionModal';
import { DeployApkModal } from '../deploy/DeployApkModal';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    partnerUser, 
    isConnectedWithPartner, 
    activePartnership, 
    switchActiveUser, 
    state, 
    logoutUser,
    triggerCelebration,
    pendingInvitationsReceived 
  } = useApp();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/80 px-4 lg:px-8 pt-[calc(max(env(safe-area-inset-top,0px),0.5rem)+0.5rem)] pb-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 shadow-sm shrink-0">
            <span className="font-extrabold text-white tracking-wider text-xs">
              NX
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-tight">Nexora</h1>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Grow Together
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 truncate max-w-[150px] sm:max-w-xs">
              {isConnectedWithPartner && partnerUser ? `With ${partnerUser.full_name}` : 'Personal Workspace'}
            </p>
          </div>
        </div>

        {/* Center/Right: Partner Connection or Flame Streak */}
        <div className="flex items-center gap-2">
          {isConnectedWithPartner && activePartnership ? (
            <div 
              onClick={triggerCelebration}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 cursor-pointer hover:bg-amber-500/20 transition-all text-xs"
              title="Shared Partner Streak"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-amber-300">
                {activePartnership.shared_streak}d
              </span>
            </div>
          ) : (
            <button
              onClick={() => setIsPartnerModalOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold transition-all ${
                pendingInvitationsReceived.length > 0
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-200'
              }`}
            >
              <Heart className="w-3 h-3 text-pink-400 fill-pink-400/20" />
              <span>
                {pendingInvitationsReceived.length > 0
                  ? `1 Invite`
                  : 'Partner'}
              </span>
            </button>
          )}
        </div>

        {/* Right: Auth Profile, APK & Account Switcher */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsDeployModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 text-indigo-300 text-xs font-semibold transition-all"
            title="Android APK & Deployment Guide"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Send APK</span>
          </button>

          {currentUser ? (
            <div className="relative">
              {/* Account Pill Dropdown Trigger */}
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
              >
                <img
                  src={currentUser.avatar_url || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                  alt={currentUser.full_name}
                  className="w-7 h-7 rounded-lg object-cover border border-white/[0.1]"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white leading-tight flex items-center gap-1.5">
                    <span>{currentUser.full_name.split(' ')[0]}</span>
                    {currentUser.role === 'admin' && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-purple-500/30 text-purple-300 font-mono">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {isConnectedWithPartner ? 'Partnered' : 'Solo Mode'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl border border-white/[0.12] p-2 shadow-2xl z-50 animate-in fade-in duration-150">
                  <div className="p-2.5 border-b border-white/[0.06] mb-1">
                    <div className="text-xs font-bold text-white">{currentUser.full_name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                      <span className={currentUser.is_email_verified ? 'text-emerald-400' : 'text-slate-500'}>
                        Email: {currentUser.is_email_verified ? 'Verified ✓' : 'Unverified'}
                      </span>
                      <span>•</span>
                      <span className={currentUser.is_phone_verified ? 'text-emerald-400' : 'text-slate-500'}>
                        Phone: {currentUser.is_phone_verified ? 'Verified ✓' : 'Unverified'}
                      </span>
                    </div>
                  </div>

                  {/* Partner Connection Button in Dropdown */}
                  <button
                    onClick={() => { setIsUserMenuOpen(false); setIsPartnerModalOpen(true); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/[0.04] flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Heart className="w-3.5 h-3.5 text-pink-400" />
                      <span>Partner Connection</span>
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {isConnectedWithPartner ? 'Manage' : 'Invite'}
                    </span>
                  </button>

                  {/* Create New / Logout */}
                  <div className="pt-2 mt-1 border-t border-white/[0.06] flex items-center justify-between">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setAuthMode('register');
                        setIsAuthModalOpen(true);
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 px-2 py-1"
                    >
                      + New Account
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logoutUser();
                      }}
                      className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 flex items-center gap-1"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] border border-white/[0.08]"
              >
                Sign In
              </button>
              <button
                onClick={() => { setAuthMode('register'); setIsAuthModalOpen(true); }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30"
              >
                Register
              </button>
            </div>
          )}
        </div>

      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      <PartnerConnectionModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
      />

      <DeployApkModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />
    </header>
  );
};
