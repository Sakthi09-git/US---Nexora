import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  HeartHandshake, 
  Code, 
  GitBranch, 
  Zap, 
  Rocket, 
  Briefcase, 
  ShieldCheck, 
  Crown,
  CheckCircle2,
  Lock,
  Award
} from 'lucide-react';

export const AchievementsView: React.FC = () => {
  const { state, currentUser, partnerUser, triggerCelebration } = useApp();

  if (!currentUser) return null;

  const isAchievementUnlocked = (achId: string, userId: string) => {
    return state.userAchievements.some((ua) => ua.achievement_id === achId && ua.user_id === userId);
  };

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 'Code':
        return <Code className="w-5 h-5 text-indigo-400" />;
      case 'GitBranch':
        return <GitBranch className="w-5 h-5 text-emerald-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-300" />;
      case 'Rocket':
        return <Rocket className="w-5 h-5 text-rose-400" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-blue-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-teal-400" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-amber-400" />;
      default:
        return <Award className="w-5 h-5 text-purple-400" />;
    }
  };

  const nextLevelXp = currentUser.level * 300;
  const currentLevelBaseXp = (currentUser.level - 1) * 300;
  const xpInCurrentLevel = currentUser.xp_points - currentLevelBaseXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / 300) * 100)));

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Milestones & Mature Gamification</h2>
          <p className="text-xs text-slate-400 mt-1">
            "We are not competing against each other. We are becoming better versions of ourselves, together."
          </p>
        </div>

        <button
          onClick={triggerCelebration}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>Celebrate Growth Milestones</span>
        </button>
      </div>

      {/* Level & XP Banner */}
      <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-[#0F111A] rounded-[14px] flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Level</span>
                <span className="text-lg font-extrabold text-white leading-none">{currentUser.level}</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{currentUser.full_name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentUser.xp_points} Total Growth XP • {300 - (xpInCurrentLevel % 300)} XP to Level {currentUser.level + 1}
              </p>
            </div>
          </div>

          <div className="w-full md:w-64">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Level {currentUser.level} Progress</span>
              <span className="text-indigo-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard or Partner comparison if connected */}
      {partnerUser && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar_url}
                  alt={currentUser.full_name}
                  className="w-10 h-10 rounded-full object-cover border border-purple-500/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{currentUser.full_name}</h4>
                  <p className="text-xs text-purple-400">Level {currentUser.level} • You</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-extrabold text-white">{currentUser.xp_points} XP</div>
                <div className="text-[10px] text-slate-400">Your XP</div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-emerald-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={partnerUser.avatar_url}
                  alt={partnerUser.full_name}
                  className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{partnerUser.full_name}</h4>
                  <p className="text-xs text-emerald-400">Level {partnerUser.level} • Partner</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-extrabold text-white">{partnerUser.xp_points} XP</div>
                <div className="text-[10px] text-slate-400">Partner XP</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements Catalog */}
      <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>Lifetime Achievements ({state.achievements.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.achievements.map((ach) => {
            const unlockedMe = isAchievementUnlocked(ach.id, currentUser.id);
            const unlockedPartner = partnerUser ? isAchievementUnlocked(ach.id, partnerUser.id) : false;
            const isUnlockedAny = unlockedMe || unlockedPartner;

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border transition-all ${
                  isUnlockedAny
                    ? 'glass-card border-amber-500/30 bg-amber-950/10'
                    : 'bg-white/[0.01] border-white/[0.04] opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl border ${
                    isUnlockedAny
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-sm'
                      : 'bg-white/[0.03] border-white/[0.06] text-slate-500'
                  }`}>
                    {isUnlockedAny ? getAchievementIcon(ach.icon) : <Lock className="w-5 h-5" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-white">{ach.title}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-semibold">
                        +{ach.xp_reward} XP
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {ach.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-white/[0.06]">
                      <span className="text-slate-500 capitalize">{ach.category} Badge</span>
                      <div className="flex items-center gap-2">
                        {unlockedMe && (
                          <span className="text-emerald-400 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3 h-3" /> You Unlocked
                          </span>
                        )}
                        {unlockedPartner && partnerUser && (
                          <span className="text-purple-400 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3 h-3" /> {partnerUser.full_name.split(' ')[0]} Unlocked
                          </span>
                        )}
                        {!isUnlockedAny && (
                          <span className="text-slate-500">In Progress</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
