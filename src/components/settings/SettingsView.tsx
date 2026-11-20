import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  Users, 
  Copy, 
  Check, 
  Database, 
  Smartphone, 
  RotateCcw, 
  ShieldCheck, 
  Globe, 
  Heart,
  Mail,
  UserCheck,
  UserX,
  Lock,
  Cloud,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { 
  isSupabaseConfigured, 
  getSupabaseCredentials, 
  saveSupabaseConfig, 
  clearSupabaseConfig 
} from '../../lib/supabase';
import { PartnerConnectionModal } from '../partner/PartnerConnectionModal';
import { DeployApkModal } from '../deploy/DeployApkModal';

export const SettingsView: React.FC = () => {
  const { 
    currentUser, 
    partnerUser, 
    isConnectedWithPartner,
    activePartnership,
    disconnectPartner,
    toggleShareProgress,
    verifyEmail,
    verifyPhoneOtp,
    resetAllData 
  } = useApp();

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [phoneOtpInput, setPhoneOtpInput] = useState('');
  const [showPhoneVerifyBox, setShowPhoneVerifyBox] = useState(false);

  // Cloud Database state
  const creds = getSupabaseCredentials();
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(creds.url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(creds.key);
  const [dbSaveFeedback, setDbSaveFeedback] = useState<string | null>(null);

  const handleSaveCloudDB = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrlInput.trim() || !supabaseKeyInput.trim()) {
      setDbSaveFeedback('Please enter both Project URL and Anon API Key.');
      return;
    }
    const ok = saveSupabaseConfig(supabaseUrlInput.trim(), supabaseKeyInput.trim());
    if (ok) {
      setDbSaveFeedback('Cloud database connected successfully! Reloading...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setDbSaveFeedback('Failed to save cloud credentials.');
    }
  };

  const handleClearCloudDB = () => {
    clearSupabaseConfig();
    setSupabaseUrlInput('');
    setSupabaseKeyInput('');
    setDbSaveFeedback('Database disconnected. Using local offline storage.');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  if (!currentUser) return null;

  const myInviteLink = `${window.location.origin}/?joinUser=${currentUser.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(myInviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleVerifyPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyPhoneOtp(phoneOtpInput)) {
      setShowPhoneVerifyBox(false);
      setPhoneOtpInput('');
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Account & Personal Workspace Settings</h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal profile, verification credentials, partner permissions, and cloud database.
        </p>
      </div>

      {/* 1. User Profile & Verification Status */}
      <div className="glass-card rounded-2xl p-6 border border-white/[0.08] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar_url || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
              alt={currentUser.full_name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{currentUser.full_name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold uppercase">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{currentUser.email}</p>
              {currentUser.phone_number && (
                <p className="text-xs text-slate-500 font-mono mt-0.5">{currentUser.phone_number}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {currentUser.is_email_verified ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Email Verified
              </span>
            ) : (
              <button
                onClick={verifyEmail}
                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30"
              >
                Verify Email Now
              </button>
            )}

            {currentUser.is_phone_verified ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Phone Verified
              </span>
            ) : (
              <button
                onClick={() => setShowPhoneVerifyBox(!showPhoneVerifyBox)}
                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30"
              >
                Verify Phone OTP
              </button>
            )}
          </div>
        </div>

        {showPhoneVerifyBox && !currentUser.is_phone_verified && (
          <form onSubmit={handleVerifyPhone} className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-center gap-3">
            <span className="text-xs text-slate-300 shrink-0">Enter OTP (e.g. 123456):</span>
            <input
              type="text"
              required
              value={phoneOtpInput}
              onChange={(e) => setPhoneOtpInput(e.target.value)}
              placeholder="123456"
              className="w-32 bg-black/40 border border-white/[0.1] rounded-lg px-3 py-1 text-xs text-white font-mono"
            />
            <button
              type="submit"
              className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
            >
              Confirm
            </button>
          </form>
        )}
      </div>

      {/* 2. Partner Connection & Sharing Permissions */}
      <div className="glass-card rounded-2xl p-6 border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400">
              <Heart className="w-6 h-6 fill-pink-400/20" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Partner Connection Status</h3>
              <p className="text-xs text-slate-400">
                {isConnectedWithPartner && partnerUser
                  ? `Connected with ${partnerUser.full_name} (${partnerUser.email})`
                  : 'Independent Solo Personal Workspace'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPartnerModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm"
          >
            {isConnectedWithPartner ? 'Manage Partner' : 'Invite Partner'}
          </button>
        </div>

        {isConnectedWithPartner && partnerUser ? (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Share My Habit Progress %</span>
                <span className="text-[11px] text-slate-400">Allows partner to see your daily completion percentage in couple synergy rings.</span>
              </div>
              <button
                type="button"
                onClick={toggleShareProgress}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  currentUser.share_progress_with_partner ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  currentUser.share_progress_with_partner ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs text-slate-500">
              <span>Anniversary: {activePartnership?.anniversary_date || '2024-06-15'}</span>
              <span>Shared Streak: {activePartnership?.shared_streak || 18} Days</span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <span className="text-xs text-slate-300 font-semibold block">Your Personal Connection Link:</span>
            <div className="flex items-center justify-between text-xs gap-2">
              <span className="text-slate-400 font-mono truncate">{myInviteLink}</span>
              <button
                onClick={handleCopyLink}
                className="px-2.5 py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-indigo-300 font-semibold shrink-0"
              >
                {copiedLink ? 'Copied Link' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Live Cloud Database Connection (Supabase) */}
      <div className="glass-card rounded-2xl p-6 border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${isSupabaseConfigured() ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Live Cloud Database</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                  isSupabaseConfigured() ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {isSupabaseConfigured() ? 'Connected' : 'Local Storage Only'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isSupabaseConfigured() 
                  ? 'All user accounts, member searches, and invitations sync across devices in real time.'
                  : 'Connect a free Supabase project so users on different phones can search and pair seamlessly.'}
              </p>
            </div>
          </div>
        </div>

        {/* Database Configuration Form */}
        <form onSubmit={handleSaveCloudDB} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
          {dbSaveFeedback && (
            <div className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
              dbSaveFeedback.includes('successfully') ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300' : 'bg-rose-950/40 border border-rose-500/30 text-rose-300'
            }`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{dbSaveFeedback}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Supabase Project URL</label>
            <input
              type="url"
              value={supabaseUrlInput}
              onChange={(e) => setSupabaseUrlInput(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Supabase Anon Public API Key</label>
            <input
              type="password"
              value={supabaseKeyInput}
              onChange={(e) => setSupabaseKeyInput(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Create free Supabase project (1 min)</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="flex gap-2">
              {isSupabaseConfigured() && (
                <button
                  type="button"
                  onClick={handleClearCloudDB}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.04] text-slate-400 hover:text-rose-400 text-xs transition-colors"
                >
                  Disconnect
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
              >
                Save &amp; Connect DB
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 4. Deploy for Personal Use & Send APK to Friend */}
      <div className="glass-card rounded-2xl p-6 border border-indigo-500/20 bg-indigo-950/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Deploy &amp; Send APK to Friend</h3>
              <p className="text-xs text-slate-400">Download Android APK or deploy for personal couple use</p>
            </div>
          </div>

          <button
            onClick={() => setIsDeployModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Open APK Guide</span>
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Includes 1-click cloud build via GitHub Actions (<code className="text-indigo-300">.github/workflows/build-apk.yml</code>), free Vercel hosting setup, and ready-to-share WhatsApp invitation with your partner code.
        </p>
      </div>

      {/* 5. Danger Zone */}
      <div className="glass-card rounded-2xl p-6 border border-rose-500/20 bg-rose-950/10 space-y-3">
        <h3 className="text-base font-bold text-white">Reset Demo State</h3>
        <p className="text-xs text-slate-400">
          Reset all users, partnerships, habits, and monthly snapshots back to the clean public default state.
        </p>

        {isResetConfirmOpen ? (
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                resetAllData();
                setIsResetConfirmOpen(false);
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
            >
              Confirm Reset
            </button>
            <button
              onClick={() => setIsResetConfirmOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/[0.05] text-slate-300 text-xs"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        )}
      </div>

      <PartnerConnectionModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
      />

      <DeployApkModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />
    </div>
  );
};
