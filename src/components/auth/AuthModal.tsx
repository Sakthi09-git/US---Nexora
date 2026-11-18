import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  UserPlus, 
  LogIn, 
  Smartphone, 
  Mail, 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  KeyRound
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const { registerUser, loginUser, verifyPhoneOtp, verifyEmail, resetPassword, currentUser } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'otp' | 'forgot'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setFeedback({ success: false, message: 'Passwords do not match.' });
      return;
    }
    setIsLoading(true);
    const res = await registerUser({
      full_name: fullName,
      email,
      phone_number: phone,
      password
    });
    setIsLoading(false);
    setFeedback(res);

    if (res.success) {
      if (phone) {
        setMode('otp');
      } else {
        setTimeout(onClose, 1500);
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await loginUser(email, password);
    setIsLoading(false);
    setFeedback(res);

    if (res.success) {
      setTimeout(onClose, 1200);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyPhoneOtp(otpCode);
    if (success) {
      setFeedback({ success: true, message: 'Phone number verified successfully!' });
      setTimeout(onClose, 1500);
    } else {
      setFeedback({ success: false, message: 'Invalid OTP. Enter at least 4 digits.' });
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const success = resetPassword(email, password);
    if (success) {
      setFeedback({ success: true, message: 'Password reset successful! You can now log in.' });
      setMode('login');
    } else {
      setFeedback({ success: false, message: 'Account not found with this email.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel rounded-2xl border border-white/[0.12] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              {mode === 'register' ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {mode === 'login' && 'Sign In to Your Workspace'}
                {mode === 'register' && 'Create Public Account'}
                {mode === 'otp' && 'Verify Phone Number'}
                {mode === 'forgot' && 'Reset Password'}
              </h3>
              <p className="text-xs text-slate-400">Nexora Growth Platform</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`p-3 rounded-xl mt-4 text-xs font-semibold flex items-center gap-2 border ${
            feedback.success
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          }`}>
            {feedback.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Tab Toggle for Login / Register */}
        {(mode === 'login' || mode === 'register') && (
          <div className="flex p-1 mt-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <button
              onClick={() => { setMode('login'); setFeedback(null); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'login' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setFeedback(null); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'register' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@example.com"
                  className="w-full bg-black/40 border border-white/[0.1] rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-black/40 border border-white/[0.1] rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500">Default demo: password123</span>
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* 2. REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Jordan Smith"
                className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan@example.com"
                  className="w-full bg-black/40 border border-white/[0.1] rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-black/40 border border-white/[0.1] rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
                <Smartphone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 chars"
                  className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Confirm *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 pt-1">
              By creating an account, you receive an independent private dashboard. All personal data is encrypted & zero-knowledge private.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30"
            >
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        )}

        {/* 3. OTP VERIFICATION */}
        {mode === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="mt-4 space-y-4">
            <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <Smartphone className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
              <p className="text-xs text-slate-300">
                Enter verification code sent to <strong className="text-white">{phone || 'your phone'}</strong>
              </p>
              <span className="text-[10px] text-slate-500 block mt-1">Simulator OTP: enter 123456</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 text-center">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-full text-center tracking-widest font-mono text-xl bg-black/40 border border-white/[0.1] rounded-xl py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-600/30"
            >
              Verify & Enter Dashboard
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-300 block"
            >
              Skip verification for now
            </button>
          </form>
        )}

        {/* 4. FORGOT PASSWORD */}
        {mode === 'forgot' && (
          <form onSubmit={handleResetPassword} className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Account Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="flex-1 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-white/[0.04]"
              >
                Back to Sign In
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
              >
                Reset Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

