import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Habit, HabitCategory } from '../../types';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Edit3, 
  Trash2, 
  Power, 
  Lock, 
  Users, 
  Clock, 
  Calendar 
} from 'lucide-react';
import { HabitModal } from './HabitModal';

const CATEGORY_TABS: { id: string; label: string }[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'health_fitness', label: 'Health & Fitness' },
  { id: 'technical_development', label: 'Technical Dev' },
  { id: 'professional_development', label: 'Professional' },
  { id: 'career_opportunities', label: 'Career & Hackathons' },
  { id: 'academic_development', label: 'Academics' },
  { id: 'personal_development', label: 'Personal Growth' },
];

export const HabitsView: React.FC<{ initialScope?: 'all' | 'my' | 'shared' }> = ({ initialScope = 'all' }) => {
  const { 
    state, 
    currentUser, 
    partnerUser, 
    isConnectedWithPartner,
    todayDateStr, 
    toggleHabitCompletion, 
    deleteHabit, 
    toggleHabitActive 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [scope, setScope] = useState<'all' | 'my' | 'shared'>(initialScope);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  if (!currentUser) return null;

  const isHabitDone = (habitId: string, userId: string) => {
    return state.habitCompletions.some(
      (c) => c.habit_id === habitId && c.user_id === userId && c.completion_date === todayDateStr && c.is_completed
    );
  };

  // Filter habits belonging to current user or approved shared partner habits
  const availableHabits = state.habits.filter((h) => {
    if (h.user_id === currentUser.id) return true;
    if (partnerUser && isConnectedWithPartner && h.user_id === partnerUser.id && h.is_shared && !h.is_private) return true;
    return false;
  });

  const filteredHabits = availableHabits.filter((h) => {
    if (activeCategory !== 'all' && h.category !== activeCategory) return false;

    if (scope === 'my') {
      if (h.user_id !== currentUser.id) return false;
    } else if (scope === 'shared') {
      if (!h.is_shared) return false;
    }

    return true;
  });

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Personal & Shared Habits</h2>
          <p className="text-xs text-slate-400 mt-1">
            Build lifelong daily habits. All records private to your workspace by default.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Habit</span>
        </button>
      </div>

      {/* Scope Selector */}
      <div className="flex items-center gap-2 p-1 rounded-xl glass-card w-fit border border-white/[0.08]">
        <button
          onClick={() => setScope('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            scope === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Available ({availableHabits.length})
        </button>
        <button
          onClick={() => setScope('my')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            scope === 'my' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          My Habits ({availableHabits.filter(h => h.user_id === currentUser.id).length})
        </button>
        {isConnectedWithPartner && (
          <button
            onClick={() => setScope('shared')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              scope === 'shared' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Shared with Partner
          </button>
        )}
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
              activeCategory === tab.id
                ? 'bg-white/[0.1] text-white border-white/[0.2]'
                : 'bg-white/[0.02] text-slate-400 border-white/[0.06] hover:bg-white/[0.04]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHabits.map((habit) => {
          const isMine = habit.user_id === currentUser.id;
          const myDone = isHabitDone(habit.id, currentUser.id);
          const partnerDone = partnerUser ? isHabitDone(habit.id, partnerUser.id) : false;

          return (
            <div
              key={habit.id}
              className={`rounded-2xl p-5 glass-card border transition-all ${
                !habit.is_active
                  ? 'opacity-50 border-white/[0.04]'
                  : isMine && myDone
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : 'border-white/[0.08]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {isMine ? (
                    <button
                      onClick={() => toggleHabitCompletion(habit.id, todayDateStr)}
                      className="mt-0.5 focus:outline-none"
                      title={myDone ? 'Mark as incomplete' : 'Mark as completed'}
                    >
                      {myDone ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-500 hover:text-slate-300" />
                      )}
                    </button>
                  ) : (
                    <div className="mt-0.5 w-6 h-6 rounded-full border border-emerald-500/40 flex items-center justify-center text-[10px] text-emerald-400">
                      {partnerDone ? '✓' : '—'}
                    </div>
                  )}

                  <div>
                    <h3 className={`text-base font-bold ${isMine && myDone ? 'line-through text-slate-400' : 'text-white'}`}>
                      {habit.name}
                    </h3>
                    {habit.description && (
                      <p className="text-xs text-slate-400 mt-0.5">{habit.description}</p>
                    )}
                  </div>
                </div>

                {isMine && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleHabitActive(habit.id)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        habit.is_active
                          ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
                          : 'text-slate-500 border-white/[0.06] bg-white/[0.02]'
                      }`}
                      title={habit.is_active ? 'Active' : 'Paused'}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleEdit(habit)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white border border-white/[0.06] bg-white/[0.02]"
                      title="Edit Habit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 border border-white/[0.06] bg-white/[0.02] hover:bg-rose-500/10"
                      title="Delete Habit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Meta pills */}
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-slate-300 font-medium capitalize border border-white/[0.06]">
                    {habit.category.replace('_', ' ')}
                  </span>
                  
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-medium border border-indigo-500/20 capitalize">
                    {habit.frequency.replace('_', ' ')}
                  </span>

                  {habit.is_private && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-medium border border-amber-500/20 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Private
                    </span>
                  )}

                  {habit.is_shared && isConnectedWithPartner && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-medium border border-emerald-500/20 flex items-center gap-1">
                      <Users className="w-3 h-3" /> Shared
                    </span>
                  )}
                </div>

                <span className="text-xs font-mono text-slate-400">
                  {habit.daily_target} {habit.target_unit}
                </span>
              </div>
            </div>
          );
        })}

        {filteredHabits.length === 0 && (
          <div className="col-span-full py-12 text-center glass-card rounded-2xl border border-white/[0.08]">
            <p className="text-sm text-slate-400">No habits found for this filter.</p>
            <button
              onClick={handleCreateNew}
              className="mt-3 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              + Create your first habit
            </button>
          </div>
        )}
      </div>

      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        habitToEdit={editingHabit}
      />
    </div>
  );
};
