import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Flame, 
  Sparkles, 
  Target, 
  Heart, 
  Send, 
  CheckCircle2, 
  Circle, 
  ArrowUpRight, 
  Trophy, 
  Clock, 
  Calendar,
  Zap,
  TrendingUp,
  Activity,
  Award,
  UserPlus
} from 'lucide-react';
import { PartnerConnectionModal } from '../partner/PartnerConnectionModal';

export const DashboardView: React.FC<{ onNavigateToTab: (tab: any) => void }> = ({ onNavigateToTab }) => {
  const { 
    currentUser, 
    partnerUser, 
    isConnectedWithPartner,
    activePartnership,
    state, 
    todayDateStr, 
    getDailyStats, 
    getMonthConsistencyScore,
    toggleHabitCompletion,
    todayMessage,
    sendEncouragement,
    selectedCycle,
    pendingInvitationsReceived,
    acceptPartnerInvitation,
    rejectPartnerInvitation
  } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);

  const stats = getDailyStats();
  const consistencyScore = getMonthConsistencyScore();

  if (!currentUser) return null;

  // Active habits for current user
  const myHabits = state.habits.filter((h) => h.user_id === currentUser.id && h.is_active);

  // Check completions for today
  const isHabitDone = (habitId: string, userId: string) => {
    return state.habitCompletions.some(
      (c) => c.habit_id === habitId && c.user_id === userId && c.completion_date === todayDateStr && c.is_completed
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    sendEncouragement(messageInput.trim());
    setMessageInput('');
    setIsSendingMsg(false);
  };

  // Partner data if connected
  const partnerHabits = partnerUser 
    ? state.habits.filter((h) => h.user_id === partnerUser.id && h.is_active && h.is_shared && !h.is_private)
    : [];
  const partnerDone = partnerUser ? partnerHabits.filter(h => isHabitDone(h.id, partnerUser.id)).length : 0;
  const partnerPercent = partnerHabits.length > 0 ? Math.round((partnerDone / partnerHabits.length) * 100) : 0;

  const myDone = myHabits.filter(h => isHabitDone(h.id, currentUser.id)).length;
  const myPercent = myHabits.length > 0 ? Math.round((myDone / myHabits.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-20 lg:pb-8">

      {/* PARTNER INVITATION RECEIVED ALERT BANNER */}
      {pendingInvitationsReceived.length > 0 && (
        <section className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-indigo-500/20 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Partner Request from {pendingInvitationsReceived[0].sender_name}!
              </h4>
              <p className="text-xs text-slate-300">
                {pendingInvitationsReceived[0].sender_name} ({pendingInvitationsReceived[0].sender_email}) wants to connect and grow together with you.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => rejectPartnerInvitation(pendingInvitationsReceived[0].id)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/[0.05]"
            >
              Decline
            </button>
            <button
              onClick={() => acceptPartnerInvitation(pendingInvitationsReceived[0].id)}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Accept &amp; Connect</span>
            </button>
          </div>
        </section>
      )}
      
      {/* 1. WELCOME SECTION */}
      <section className="relative overflow-hidden rounded-2xl glass-card p-6 md:p-8 border border-white/[0.08]">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Wednesday, November 18, 2026 • Day 18 of 30</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Good afternoon, {currentUser.full_name} {partnerUser ? `& ${partnerUser.full_name}` : ''}
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-xl font-normal leading-relaxed">
              "{selectedCycle?.theme_quote || 'Two individuals. One journey. Better every month.'}"
            </p>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-xs text-slate-400">Current Challenge</span>
            <span className="text-sm font-bold text-indigo-300">
              {selectedCycle?.title || 'November Growth Cycle'}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium">
              Target: {selectedCycle?.target_score || 85}% consistency
            </span>
          </div>
        </div>
      </section>

      {/* 2. ENCOURAGEMENT MESSAGE OR PARTNER INVITE CALLOUT */}
      {isConnectedWithPartner ? (
        <section className="rounded-xl p-4 glass-card border border-indigo-500/20 bg-gradient-to-r from-indigo-950/30 via-purple-950/20 to-transparent">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 mt-0.5">
                <Heart className="w-4 h-4 fill-pink-400/20" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-pink-300">Today's Couple Note</span>
                  <span className="text-[10px] text-slate-500">Shared daily note</span>
                </div>
                <p className="text-sm text-slate-200 mt-1 italic">
                  {todayMessage ? `"${todayMessage}"` : "Leave a brief uplifting note for your partner to motivate their day!"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsSendingMsg(!isSendingMsg)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border border-white/[0.08] transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>{isSendingMsg ? 'Cancel' : 'Write Note'}</span>
            </button>
          </div>

          {isSendingMsg && (
            <form onSubmit={handleSendMessage} className="mt-3 pt-3 border-t border-white/[0.06] flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Write an encouraging note for ${partnerUser?.full_name}...`}
                className="flex-1 bg-black/40 border border-white/[0.1] rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1 shadow-sm"
              >
                <Send className="w-3 h-3" />
                <span>Send</span>
              </button>
            </form>
          )}
        </section>
      ) : (
        <section className="rounded-xl p-4 glass-card border border-pink-500/30 bg-gradient-to-r from-pink-950/20 via-purple-950/20 to-transparent flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400">
              <Heart className="w-5 h-5 fill-pink-400/20" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Unlock Shared Couple Growth</h4>
              <p className="text-xs text-slate-400">
                You are currently in Solo Mode. Connect with a partner to unlock shared habit rings and couple streaks!
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPartnerModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shrink-0 shadow-sm"
          >
            Connect Partner
          </button>
        </section>
      )}

      {/* 3. GROWTH OVERVIEW */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Synergy or Personal Consistency Metric */}
        <div className="glass-card rounded-2xl p-5 border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              {isConnectedWithPartner ? 'Couple Synergy' : 'Personal Consistency'}
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{stats.couplePercent}%</span>
            <span className="text-xs text-emerald-400 font-semibold">Today</span>
          </div>
          <div className="mt-3 w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-700" 
              style={{ width: `${stats.couplePercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {stats.coupleCompleted} of {stats.coupleTotal} habits fulfilled today
          </p>
        </div>

        {/* Streak */}
        <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              {isConnectedWithPartner ? 'Shared Streak' : 'Personal Streak'}
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {activePartnership ? activePartnership.shared_streak : (stats.currentStreak || 0)}
            </span>
            <span className="text-xs text-amber-300 font-semibold">Days Continuous</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>All-time Best: {activePartnership ? activePartnership.best_shared_streak : (stats.currentStreak || 0)}d</span>
            <span className="text-amber-400 font-medium">Active</span>
          </div>
        </div>

        {/* Monthly Consistency */}
        <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Monthly Consistency</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{consistencyScore}%</span>
            <span className="text-xs text-emerald-400 font-semibold">Nov 2026</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>Target: {selectedCycle?.target_score || 85}%</span>
            <span className="text-emerald-400 font-medium">On Track</span>
          </div>
        </div>

        {/* Pending Activities */}
        <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pending Activities</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{stats.pendingActivities}</span>
            <span className="text-xs text-purple-300 font-semibold">Habits Left</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>Your checklist</span>
            <span className="text-indigo-300 font-medium">{stats.individualPercent}% done</span>
          </div>
        </div>
      </section>

      {/* 4. PROGRESS CARDS */}
      <section className={`grid grid-cols-1 ${isConnectedWithPartner ? 'md:grid-cols-2' : ''} gap-4`}>
        {/* Current User Card */}
        <div className="rounded-2xl p-6 glass-card border border-indigo-500/40 glow-partner-a">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar_url || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                alt={currentUser.full_name}
                className="w-11 h-11 rounded-full object-cover border-2 border-indigo-500/50"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{currentUser.full_name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium">
                    You
                  </span>
                </div>
                <p className="text-xs text-slate-400">Level {currentUser.level} • {currentUser.xp_points} XP</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-indigo-400">{myPercent}%</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Today's Score</div>
            </div>
          </div>

          <div className="mt-4 w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${myPercent}%` }}
            />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
            <div>
              <div className="text-xs text-slate-400 font-medium">Completed</div>
              <div className="text-sm font-bold text-white mt-0.5">{myDone}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Remaining</div>
              <div className="text-sm font-bold text-white mt-0.5">{Math.max(0, myHabits.length - myDone)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Active Streak</div>
              <div className="text-sm font-bold text-amber-400 mt-0.5">18d 🔥</div>
            </div>
          </div>
        </div>

        {/* Partner Card if Connected */}
        {isConnectedWithPartner && partnerUser && (
          <div className="rounded-2xl p-6 glass-card border border-emerald-500/40 glow-partner-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={partnerUser.avatar_url || 'https://api.dicebear.com/7.x/initials/svg?seed=Partner'}
                  alt={partnerUser.full_name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500/50"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{partnerUser.full_name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                      Partner
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Level {partnerUser.level} • {partnerUser.xp_points} XP</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-emerald-400">{partnerPercent}%</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Today's Score</div>
              </div>
            </div>

            <div className="mt-4 w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${partnerPercent}%` }}
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
              <div>
                <div className="text-xs text-slate-400 font-medium">Completed</div>
                <div className="text-sm font-bold text-white mt-0.5">{partnerDone}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Remaining</div>
                <div className="text-sm font-bold text-white mt-0.5">{Math.max(0, partnerHabits.length - partnerDone)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Active Streak</div>
                <div className="text-sm font-bold text-amber-400 mt-0.5">{stats.currentStreak || 0}d 🔥</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5. TODAY'S HABIT ACTION LIST */}
      <section className="rounded-2xl glass-card p-6 border border-white/[0.08]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Today's Daily Checklist</span>
              <span className="text-xs font-normal text-slate-400">({currentUser.full_name})</span>
            </h3>
            <p className="text-xs text-slate-400">Tap to mark completed. Updates sync instantly across devices.</p>
          </div>
          <button
            onClick={() => onNavigateToTab('my-habits')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>Manage All Habits</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {myHabits.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-xl border border-dashed border-white/[0.1] bg-white/[0.01]">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center mb-3">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-white">No habits created yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                Start building your routine! Add your first daily habit to track your personal growth and build streaks.
              </p>
              <button
                onClick={() => onNavigateToTab('my-habits')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
              >
                + Create Your First Habit
              </button>
            </div>
          ) : (
            myHabits.slice(0, 6).map((habit) => {
              const completed = isHabitDone(habit.id, currentUser.id);

              return (
                <div
                  key={habit.id}
                  onClick={() => toggleHabitCompletion(habit.id, todayDateStr)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                    completed
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button className="text-slate-400 focus:outline-none">
                      {completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20 animate-in zoom-in-75 duration-200" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                      )}
                    </button>
                    <div>
                      <h4 className={`text-sm font-medium ${completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                        {habit.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-500 capitalize">
                          {habit.category.replace('_', ' ')}
                        </span>
                        {habit.is_shared && partnerUser && (
                          <span className="text-[10px] text-indigo-400">
                            • Shared with {partnerUser.full_name.split(' ')[0]}
                          </span>
                        )}
                        {habit.is_private && (
                          <span className="text-[10px] text-amber-400/80">
                            • Private
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">
                      {habit.daily_target} {habit.target_unit}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <PartnerConnectionModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
      />
    </div>
  );
};
