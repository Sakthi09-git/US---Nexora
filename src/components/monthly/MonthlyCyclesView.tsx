import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CalendarRange, 
  Target, 
  Plus, 
  CheckCircle2, 
  Circle, 
  RotateCw, 
  History, 
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Database
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { FinalizeMonthModal } from './FinalizeMonthModal';

export const MonthlyCyclesView: React.FC = () => {
  const { 
    state, 
    selectedCycle, 
    setSelectedMonthYear, 
    addMonthlyGoal, 
    toggleMonthlyGoal, 
    getMonthConsistencyScore,
    currentUser,
    partnerUser,
    isConnectedWithPartner,
    previewMonthFinalization
  } = useApp();

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState(1);
  const [newGoalCategory, setNewGoalCategory] = useState('technical_development');

  if (!currentUser) return null;

  const consistencyScore = getMonthConsistencyScore(state.selectedMonthYear);
  const currentGoals = state.monthlyGoals.filter((g) => g.user_id === currentUser.id && g.cycle_id === selectedCycle?.id);

  // Live preview numbers for active month
  const activePreview = previewMonthFinalization(state.selectedMonthYear);

  // LIFETIME PROGRESS HISTORY (Compact Summaries for Current User)
  const mySummaries = state.monthlySummaries.filter((s) => s.user_id === currentUser.id);

  const historyComparisonData = [
    ...mySummaries.map((s) => ({
      monthYear: `${s.month.slice(0, 3)} ${s.year}`,
      me: s.completion_percentage,
      partner: s.partner_completion_percentage || 0,
      couple: s.couple_completion_percentage || s.completion_percentage
    })),
    {
      monthYear: `${activePreview.monthName.slice(0, 3)} ${activePreview.year}`,
      me: activePreview.user_pct,
      partner: activePreview.partner_pct || 0,
      couple: activePreview.couple_pct || activePreview.user_pct
    }
  ];

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    addMonthlyGoal({
      cycle_id: selectedCycle?.id,
      title: newGoalTitle.trim(),
      category: newGoalCategory,
      target_value: Number(newGoalTarget),
      user_id: currentUser.id
    });

    setNewGoalTitle('');
    setIsGoalModalOpen(false);
  };

  const formatHoursMins = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Monthly Growth & Lifetime Snapshots</h2>
          <p className="text-xs text-slate-400 mt-1">
            Minimal Data Retention: Full daily editing in active month; only compact summary percentages saved at month-end.
          </p>
        </div>

        <button
          onClick={() => setIsFinalizeModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
        >
          <RotateCw className="w-4 h-4" />
          <span>Finalize & Roll Over Month</span>
        </button>
      </div>

      {/* 1. ACTIVE MONTH BANNER & LIVE SNAPSHOT */}
      <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/[0.08] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active Growth Month: {selectedCycle?.month_year} (Full Daily Records Live)</span>
            </div>

            <h3 className="text-2xl font-bold text-white">{selectedCycle?.title}</h3>
            <p className="text-sm text-slate-300 mt-2 italic max-w-xl">
              "{selectedCycle?.theme_quote}"
            </p>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
            <div>
              <div className="text-[11px] text-slate-400">Your Consistency</div>
              <div className="text-xl font-extrabold text-indigo-400 mt-0.5">
                {activePreview.user_pct}%
              </div>
            </div>

            {isConnectedWithPartner && partnerUser && (
              <>
                <div className="w-px h-8 bg-white/[0.08]" />
                <div>
                  <div className="text-[11px] text-slate-400">Partner ({partnerUser.full_name.split(' ')[0]})</div>
                  <div className="text-xl font-extrabold text-emerald-400 mt-0.5">
                    {activePreview.partner_pct}%
                  </div>
                </div>
                <div className="w-px h-8 bg-white/[0.08]" />
                <div>
                  <div className="text-[11px] text-slate-400">Combined Couple</div>
                  <div className="text-xl font-extrabold text-amber-400 mt-0.5">
                    {activePreview.couple_pct}%
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs text-slate-400">
          <span>Active month logs are fully editable until finalized.</span>
          <span className="text-amber-400 font-medium">Ready for Month-End Snapshot</span>
        </div>
      </div>

      {/* 2. LIFETIME PROGRESS HISTORY (Compact Summaries Only) */}
      <div className="glass-card rounded-2xl p-6 border border-white/[0.08] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-400" />
              <span>Lifetime Progress History</span>
            </h3>
            <p className="text-xs text-slate-400">
              Only verified monthly summary percentages preserved. Daily historical clutter is permanently purged.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {mySummaries.length + 1} Lifetime Cycles
          </span>
        </div>

        {/* Compact Monthly Snapshot Cards */}
        <div className="space-y-3">
          {mySummaries.map((summary) => (
            <div
              key={summary.id}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    {summary.month} {summary.year}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                    Finalized Summary
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                  <span>Your Completion: <strong className="text-indigo-300">{summary.completion_percentage}%</strong></span>
                  {summary.partner_completion_percentage !== undefined && summary.partner_completion_percentage !== null && (
                    <>
                      <span>•</span>
                      <span>Partner: <strong className="text-emerald-300">{summary.partner_completion_percentage}%</strong></span>
                      <span>•</span>
                      <span>Couple: <strong className="text-amber-300">{summary.couple_completion_percentage}%</strong></span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-400 text-right">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Screen Avg</div>
                  <div className="text-slate-200">
                    {formatHoursMins(summary.screen_time_avg)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Total Completed</div>
                  <div className="text-emerald-400 font-bold">{summary.total_habits_completed}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Current Active Month In Progress Entry */}
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  {activePreview.monthName} {activePreview.year}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 font-semibold animate-pulse">
                  Current Month (In Progress)
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-3">
                <span>Your Score: <strong className="text-indigo-400">{activePreview.user_pct}%</strong></span>
                {isConnectedWithPartner && partnerUser && (
                  <>
                    <span>•</span>
                    <span>Partner: <strong className="text-emerald-400">{activePreview.partner_pct}%</strong></span>
                    <span>•</span>
                    <span>Couple: <strong className="text-amber-400">{activePreview.couple_pct}%</strong></span>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsFinalizeModalOpen(true)}
              className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-semibold border border-amber-500/30 self-start sm:self-center transition-all"
            >
              Finalize Month Now
            </button>
          </div>
        </div>

        {/* 3. SIMPLE COMPARISON CHART */}
        <div className="pt-4 border-t border-white/[0.06]">
          <h4 className="text-sm font-bold text-white mb-2">
            Monthly Completion Percentages Comparison
          </h4>
          <p className="text-xs text-slate-400 mb-4">
            Rendered strictly from compact monthly summary records.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historyComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="monthYear" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F111A',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="me" name={`You (${currentUser.full_name.split(' ')[0]}) (%)`} fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                {isConnectedWithPartner && partnerUser && (
                  <>
                    <Bar dataKey="partner" name={`Partner (${partnerUser.full_name.split(' ')[0]}) (%)`} fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="couple" name="Couple Average (%)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. ACTIVE MONTH GOALS */}
      <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" />
              <span>Personal Monthly Goals ({state.selectedMonthYear})</span>
            </h3>
            <p className="text-xs text-slate-400">Target milestones set specifically for this growth window.</p>
          </div>

          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Monthly Goal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentGoals.map((goal) => (
            <div
              key={goal.id}
              onClick={() => toggleMonthlyGoal(goal.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
                goal.is_completed
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button className="mt-0.5 focus:outline-none">
                    {goal.is_completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                    )}
                  </button>
                  <div>
                    <h4 className={`text-sm font-semibold ${goal.is_completed ? 'line-through text-slate-400' : 'text-white'}`}>
                      {goal.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 capitalize mt-1 block">
                      {goal.category}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono font-semibold text-slate-300">
                  {goal.current_value} / {goal.target_value}
                </span>
              </div>
            </div>
          ))}

          {currentGoals.length === 0 && (
            <div className="col-span-full py-6 text-center text-xs text-slate-400">
              No goals set for this cycle yet. Add your first monthly target!
            </div>
          )}
        </div>
      </div>

      <FinalizeMonthModal
        isOpen={isFinalizeModalOpen}
        onClose={() => setIsFinalizeModalOpen(false)}
        monthYear={state.selectedMonthYear}
      />

      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel rounded-2xl border border-white/[0.12] p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Add Monthly Target Goal</h3>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Goal Description *</label>
                <input
                  type="text"
                  required
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="e.g. Solve 50 LeetCode problems"
                  className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Value</label>
                <input
                  type="number"
                  min="1"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
