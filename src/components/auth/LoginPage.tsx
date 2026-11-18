import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  Sparkles
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginUser, registerUser, resetPassword, state } = useApp();

  const [mode, setMode] = useState<'signin' | 'register' | 'forgot'>(
    state.allUsers.length === 0 ? 'register' : 'signin'
  );
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [partnerInviteCode, setPartnerInviteCode] = useState('');

  // Handle ?join=CODE in URL query or sessionStorage
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const join = params.get('join') || params.get('joinUser') || sessionStorage.getItem('nexora_pending_join');
      if (join) {
        setPartnerInviteCode(join.toUpperCase());
        setMode('register');
      }
    } catch {
      // Ignore
    }
  }, []);

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

    if (password.length < 6) {
      setFeedback({ success: false, message: 'Password must be at least 6 characters.' });
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      setFeedback({ success: false, message: 'Passwords do not match.' });
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({
        full_name: fullName,
        email,
        password,
        partnerInviteCode: partnerInviteCode.trim() || undefined
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
      setFeedback({ success: true, message: 'Verification code sent! (Use code: 123456)' });
    } else {
      if (otpCode !== '123456' && otpCode.length < 4) {
        setFeedback({ success: false, message: 'Invalid verification code. Enter 123456.' });
        return;
      }
      if (newPassword.length < 6) {
        setFeedback({ success: false, message: 'New password must be at least 6 characters.' });
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
        }, 1200);
      } else {
        setFeedback({ success: false, message: 'Failed to reset password.' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Top Header - Safe Area Spacing to avoid status bar and camera notch */}
      <header className="w-full max-w-md mx-auto px-6 pt-[calc(max(env(safe-area-inset-top,0px),1rem)+1.25rem)] pb-4 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-md shadow-black/50 mb-3">
          <span className="font-extrabold text-white text-lg tracking-wider">
            NX
          </span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">Nexora</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Two individuals. One journey. Better every month.</p>
      </header>

      {/* Main Authentication Card */}
      <main className="w-full max-w-md mx-auto px-4 py-2 flex-1 flex flex-col justify-center">
        <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800/90 p-5 sm:p-7 shadow-xl shadow-black/40 backdrop-blur-md">
          
          {/* Segmented Mode Switcher */}
          {mode !== 'forgot' && (
            <div className="grid grid-cols-2 p-1 rounded-xl bg-zinc-950/80 border border-zinc-800/80 mb-5">
              <button
                type="button"
                onClick={() => { setMode('signin'); setFeedback(null); }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'signin'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setFeedback(null); }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'register'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Heading */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white tracking-tight">
              {mode === 'signin' && 'Welcome back'}
              {mode === 'register' && 'Create your account'}
              {mode === 'forgot' && 'Reset password'}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {mode === 'signin' && 'Sign in to access your habits and shared progress.'}
              {mode === 'register' && 'Start solo or connect with your partner using an invite code.'}
              {mode === 'forgot' && 'Enter your email address to recover your account.'}
            </p>
          </div>

          {/* Feedback Alert */}
          {feedback && (
            <div className={`p-3 rounded-xl mb-4 text-xs font-medium border flex items-start gap-2.5 ${
              feedback.success
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
            }`}>
              {feedback.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{feedback.message}</span>
            </div>
          )}

          {/* 1. SIGN IN FORM */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-3.5">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1.5">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-zinc-300">Password</label>
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
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 min-h-[46px]"
              >
                {loading ? 'Signing In...' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 2. REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1.5">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1.5">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Partner Invite Code (Clean & Explicit) */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Partner Invite Code</span>
                  </label>
                  <span className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">Optional</span>
                </div>
                <input
                  type="text"
                  value={partnerInviteCode}
                  onChange={(e) => setPartnerInviteCode(e.target.value.toUpperCase())}
                  placeholder="e.g. NX-A7B2C9"
                  className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 font-mono tracking-wider uppercase focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <p className="text-[11px] text-zinc-400 mt-1 leading-normal">
                  Enter your partner's 6-character code to link profiles immediately upon signup.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 min-h-[46px]"
              >
                {loading ? 'Creating Account...' : 'Create Account & Get Started'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 3. FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-3.5">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1.5">Registered Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                </div>
              </div>

              {otpSent && (
                <>
                  <div>
                    <label className="text-xs font-medium text-zinc-300 block mb-1.5">Verification Code</label>
                    <input
                      type="text"
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter 123456"
                      className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-zinc-300 block mb-1.5">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all min-h-[46px]"
              >
                {otpSent ? 'Update Password' : 'Send Verification Code'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setFeedback(null); }}
                  className="text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}

        </div>
      </main>

      {/* Subtle Mobile-Friendly Footer */}
      <footer className="w-full max-w-md mx-auto px-6 pt-2 pb-[calc(max(env(safe-area-inset-bottom,0px),0.75rem)+0.75rem)] text-center text-[11px] text-zinc-400">
        <p>Nexora &bull; Private Habit &amp; Couple Growth Workspace</p>
      </footer>
    </div>
  );
};
export default LoginPage;
