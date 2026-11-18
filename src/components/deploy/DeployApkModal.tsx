import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Smartphone, 
  Globe, 
  Send, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  Terminal, 
  Cloud, 
  Download, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface DeployApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployApkModal: React.FC<DeployApkModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useApp();
  const [activeSection, setActiveSection] = useState<'apk' | 'deploy' | 'sync'>('apk');
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isOpen || !currentUser) return null;

  const inviteCode = `US-${currentUser.id.slice(-6).toUpperCase()}`;
  const deployedUrl = window.location.origin;

  const shareText = `Hey! I set up our couple growth app "Nexora".
Open this link to install and connect:
${deployedUrl}/?join=${inviteCode}

My Partner Invite Code: ${inviteCode}
Let's build discipline and grow together! 💪❤️`;

  const handleCopyShareText = () => {
    navigator.clipboard.writeText(shareText);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  const handleWhatsAppShare = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const envTemplate = `# Cloud Sync for Two Phones (Supabase)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(envTemplate);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-white/[0.12] p-6 shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Deploy &amp; Send APK to Friend</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Android &amp; Cloud Ready
                </span>
              </h3>
              <p className="text-xs text-slate-400">Step-by-step guide to run together on two mobile phones</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex p-1 rounded-xl bg-black/40 border border-white/[0.08] mt-4 shrink-0">
          <button
            onClick={() => setActiveSection('apk')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeSection === 'apk'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>1. Get Android APK</span>
          </button>
          <button
            onClick={() => setActiveSection('deploy')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeSection === 'deploy'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>2. Cloud Deploy (Free)</span>
          </button>
          <button
            onClick={() => setActiveSection('sync')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeSection === 'sync'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>3. Share with Friend</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 pr-1 mt-4 space-y-4">
          
          {/* SECTION 1: GET ANDROID APK */}
          {activeSection === 'apk' && (
            <div className="space-y-4">
              
              {/* Method 1: Cloud GitHub Actions Builder */}
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Option A: Automated Cloud APK Builder (Recommended)
                    </h4>
                  </div>
                  <span className="text-[10px] text-indigo-300 font-medium bg-indigo-500/10 px-2 py-0.5 rounded">
                    Zero Setup Required
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We have configured a pre-built GitHub Actions workflow in <code className="text-indigo-300">.github/workflows/build-apk.yml</code>. Whenever you push this code to GitHub:
                </p>
                <ol className="text-xs text-slate-400 space-y-1.5 list-decimal pl-4">
                  <li>Push your repository to GitHub (e.g. <code className="text-slate-300">git push origin main</code>).</li>
                  <li>In GitHub, click the <strong>Actions</strong> tab and select <strong>"Build Android APK"</strong>.</li>
                  <li>Click <strong>"Run workflow"</strong> — GitHub will compile the APK in 2 minutes for free.</li>
                  <li>Download the generated <strong>Nexora.apk</strong> artifact and send it to your friend!</li>
                </ol>
              </div>

              {/* Method 2: Instant PWA WebAPK */}
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Option B: Instant Mobile App (No File Download)
                    </h4>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-medium bg-emerald-500/10 px-2 py-0.5 rounded">
                    Easiest for Friend
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your application is a full Progressive Web App (PWA). When you or your friend open your deployed URL on Android (in Chrome, Brave, or Edge):
                </p>
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-slate-300 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Tap the 3 dots in Chrome &rarr; tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>. Android creates a native WebAPK with full offline support and app icon!</span>
                </div>
              </div>

              {/* Method 3: Local Android Studio Build */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-slate-400" />
                  <span>Option C: Local Gradle Build (If Android Studio is Installed)</span>
                </h4>
                <div className="p-2.5 rounded-xl bg-black/60 font-mono text-[11px] text-slate-300 select-all">
                  cd android &amp;&amp; gradlew assembleDebug
                </div>
                <p className="text-[11px] text-slate-500">
                  Output APK location: <code className="text-slate-400">android/app/build/outputs/apk/debug/app-debug.apk</code>
                </p>
              </div>

            </div>
          )}

          {/* SECTION 2: FREE CLOUD DEPLOYMENT */}
          {activeSection === 'deploy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Why Cloud Deploy is Required for Two Phones
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  When you send the APK to your friend, their phone cannot access <code className="text-indigo-300">localhost:5173</code> on your laptop. Deploying the app online (100% free) gives you a public URL (e.g. <code className="text-indigo-300">https://nexora.vercel.app</code>) that both of your phones can reach 24/7!
                </p>
              </div>

              {/* Vercel 1-Click Deploy */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <span>Deploy to Vercel in 2 Minutes (Free)</span>
                </h4>
                <ol className="text-xs text-slate-400 space-y-1.5 list-decimal pl-4">
                  <li>Push your code to a GitHub repository.</li>
                  <li>Go to <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-indigo-400 underline">vercel.com</a> and sign in with GitHub.</li>
                  <li>Click <strong>"Add New" &rarr; "Project"</strong>, select your <code className="text-slate-300">Nexora</code> repo, and click <strong>Deploy</strong>.</li>
                  <li>Vercel gives you your live HTTPS address instantly!</li>
                </ol>
              </div>

              {/* Supabase Free Cloud DB */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Real-Time Database Sync (Supabase)</span>
                  </h4>
                  <button
                    onClick={handleCopyEnv}
                    className="text-[10px] text-indigo-300 hover:text-white flex items-center gap-1 bg-white/[0.05] px-2 py-1 rounded"
                  >
                    {copiedEnv ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedEnv ? 'Copied' : 'Copy .env snippet'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300">
                  Create a free project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-indigo-400 underline">supabase.com</a>, run the SQL script in <code className="text-slate-300">supabase/schema.sql</code>, and paste your URL and Anon Key into your Vercel Environment Variables.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 3: SHARE WITH FRIEND */}
          {activeSection === 'sync' && (
            <div className="space-y-4">
              
              <div className="p-4 rounded-2xl bg-pink-950/20 border border-pink-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Ready-to-Send Invitation Message
                  </h4>
                </div>
                <p className="text-xs text-slate-300">
                  Send this formatted message to your friend via WhatsApp, Telegram, or SMS. It includes your personal connection code so you are paired automatically!
                </p>

                <div className="p-3 rounded-xl bg-black/60 border border-white/[0.08] text-xs text-slate-200 font-mono whitespace-pre-wrap">
                  {shareText}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCopyShareText}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/[0.08]"
                  >
                    {copiedMsg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMsg ? 'Message Copied!' : 'Copy Message'}</span>
                  </button>

                  <button
                    onClick={handleWhatsAppShare}
                    className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Send via WhatsApp</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  How Pairing Works on Mobile
                </h4>
                <ol className="text-xs text-slate-400 space-y-1.5 list-decimal pl-4">
                  <li>Your friend installs the APK (or adds to home screen via Chrome).</li>
                  <li>They open the app, click <strong>"Register"</strong>, and enter their name and email.</li>
                  <li>They enter your invite code <code className="text-indigo-300 font-bold">{inviteCode}</code> in the Partner tab.</li>
                  <li>Your phones are now linked! You will see mutual completion rings, couple streaks, and notes instantly.</li>
                </ol>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
