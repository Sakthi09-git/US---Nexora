import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Flame,
  Smartphone,
  Users,
  Compass,
  KeyRound
} from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
];

export const LoginPage: React.FC = () => {
  const { loginUser, registerUser, resetPassword, state } = useApp();

  const [mode, setMode] = useState<'signin' | 'register' | 'forgot'>('signin');
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);

  // Forgot Password Fields
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Feedback State
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setLoading(true);

    try {
      const res = await loginUser(email, password);
      if (!res.success) {
        setFeedback({ success: false, message: res.message });
      }
    } catch {
      setFeedback({ success: false, message: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (password !== confirmPassword) {
      setFeedback({ success: false, message: 'Passwords do not match. Please re-enter.' });
      return;
    }

    if (password.length < 6) {
      setFeedback({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({
        full_name: fullName,
        email,
        phone_number: phone,
        password,
        avatar_url: selectedAvatar
      });

      if (!res.success) {
        setFeedback({ success: false, message: res.message });
      }
    } catch {
      setFeedback({ success: false, message: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!otpSent) {
      const user = state.allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        setFeedback({ success: false, message: 'No registered user found with this email address.' });
        return;
      }
      setOtpSent(true);
      setFeedback({ success: true, message: 'Verification code sent! (Demo Code: 123456)' });
    } else {
      if (otpCode !== '123456' && otpCode.length < 4) {
        setFeedback({ success: false, message: 'Invalid verification code. Enter 123456.' });
        return;
      }
      if (newPassword.length < 6) {
        setFeedback({ success: false, message: 'New password must be at least 6 characters long.' });
        return;
      }

      const ok = resetPassword(email, newPassword);
      if (ok) {
        setFeedback({ success: true, message: 'Password successfully updated! You can now sign in.' });
        setTimeout(() => {
          setMode('signin');
          setPassword(newPassword);
          setOtpSent(false);
          setOtpCode('');
        }, 1500);
      } else {
        setFeedback({ success: false, message: 'Failed to reset password.' });
      }
    }
  };

  const handleQuickLogin = (quickEmail: string, quickPass: string = 'password123') => {
    setEmail(quickEmail);
    setPassword(quickPass);
    loginUser(quickEmail, quickPass);
  };

  return (
    <div className="min-h-screen bg-[#07080C] text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Top Subtle Header */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#090A0F] rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 tracking-wider text-base">
                NX
              </span>
            </div>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">Nexora</h1>
            <p className="text-[11px] text-slate-400">Two individuals. One journey. Better every month.</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zero-Knowledge Privacy & Monthly Snapshots</span>
        </div>
      </header>

      {/* Main Form Centerpiece */}
      <main className="w-full max-w-md mx-auto px-4 py-8">
        
        {/* Glow Halo */}
        <div className="relative">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-70 pointer-events-none" />

          <div className="relative glass-panel rounded-3xl border border-white/[0.12] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            
            {/* Title & Mode Switcher */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Lifetime Couple & Solo Growth Platform</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                {mode === 'signin' && 'Welcome Back'}
                {mode === 'register' && 'Create Your Account'}
                {mode === 'forgot' && 'Reset Your Password'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {mode === 'signin' && 'Sign in to access your personal workspace and shared synergy.'}
                {mode === 'register' && 'Start your independent growth journey or connect with your partner.'}
                {mode === 'forgot' && 'Enter your email address to recover your account credentials.'}
              </p>
            </div>

            {/* Mode Switch Tabs */}
            {mode !== 'forgot' && (
              <div className="flex p-1 rounded-xl bg-black/40 border border-white/[0.08] mb-6">
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setFeedback(null); }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    mode === 'signin'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setFeedback(null); }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    mode === 'register'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Register Account
                </button>
              </div>
            )}

            {/* Feedback Alert */}
            {feedback && (
              <div className={`p-3 rounded-xl mb-4 text-xs font-medium border flex items-start gap-2 ${
                feedback.success
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
              }`}>
                {feedback.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            {/* 1. SIGN IN FORM */}
            {mode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-black/40 border border-white/[0.1] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setFeedback(null); }}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black/40 border border-white/[0.1] rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? 'Signing In...' : 'Sign In to Workspace'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Quick Test Accounts */}
                <div className="pt-4 border-t border-white/[0.08]">
                  <p className="text-[11px] text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Quick Test Login (1-Click Access):</span>
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('alex@growth.us')}
                      className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-left transition-all group"
                    >
                      <div className="text-[11px] font-bold text-white group-hover:text-indigo-300">Alex R.</div>
                      <div className="text-[10px] text-emerald-400">Partnered</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('sam@growth.us')}
                      className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-left transition-all group"
                    >
                      <div className="text-[11px] font-bold text-white group-hover:text-indigo-300">Sam C.</div>
                      <div className="text-[10px] text-emerald-400">Partnered</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('maya@growth.us')}
                      className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-left transition-all group"
                    >
                      <div className="text-[11px] font-bold text-white group-hover:text-indigo-300">Maya P.</div>
                      <div className="text-[10px] text-indigo-400">Solo Mode</div>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* 2. REGISTER FORM */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      className="w-full bg-black/40 border border-white/[0.1] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="elena@example.com"
                      className="w-full bg-black/40 border border-white/[0.1] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number (Optional for OTP)</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 00000"
                      className="w-full bg-black/40 border border-white/[0.1] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* Avatar Picker */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Choose Avatar</label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {PRESET_AVATARS.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedAvatar(av)}
                        className={`w-9 h-9 rounded-full overflow-hidden shrink-0 border-2 transition-all ${
                          selectedAvatar === av ? 'border-indigo-500 scale-110 shadow-md shadow-indigo-500/40' : 'border-white/[0.1] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={av} alt="avatar" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Confirm</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Account & Enter Workspace'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* 3. FORGOT PASSWORD */}
            {mode === 'forgot' && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Registered Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-black/40 border border-white/[0.1] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                {otpSent && (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">Verification Code (OTP)</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="Enter 123456"
                          className="w-full bg-black/40 border border-white/[0.1] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                        <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">New Password</label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min. 6 characters"
                          className="w-full bg-black/40 border border-white/[0.1] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  {otpSent ? 'Update Password' : 'Send Verification Code'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setMode('signin'); setFeedback(null); }}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <Heart className="w-4 h-4 text-pink-400 mx-auto mb-1.5" />
            <div className="text-[11px] font-bold text-white">Couple Synergy</div>
            <div className="text-[10px] text-slate-400">Share habits & streaks</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1.5" />
            <div className="text-[11px] font-bold text-white">Monthly Snapshot</div>
            <div className="text-[10px] text-slate-400">Minimal data footprint</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <Smartphone className="w-4 h-4 text-indigo-400 mx-auto mb-1.5" />
            <div className="text-[11px] font-bold text-white">Android APK / PWA</div>
            <div className="text-[10px] text-slate-400">Install on your phone</div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-6 text-center text-xs text-slate-500">
        <p>Nexora &bull; Multi-User Personal Growth &amp; Couple Accountability Platform &bull; Built with Privacy-First Architecture</p>
      </footer>
    </div>
  );
};
