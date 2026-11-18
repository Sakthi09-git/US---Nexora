import React, { useState } from 'react';
import { Habit, HabitCategory, HabitFrequency } from '../../types';
import { X, Check, Lock, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitToEdit?: Habit | null;
}

const CATEGORIES: { id: HabitCategory; label: string }[] = [
  { id: 'health_fitness', label: 'Health & Fitness' },
  { id: 'technical_development', label: 'Technical Development (LeetCode, DSA, GitHub)' },
  { id: 'professional_development', label: 'Professional Development (Resume, LinkedIn)' },
  { id: 'career_opportunities', label: 'Career & Opportunities (Hackathons, Interviews)' },
  { id: 'academic_development', label: 'Academic Development (CS Subjects, Revision)' },
  { id: 'personal_development', label: 'Personal Development (Reading, Discipline)' },
];

const WEEKDAYS = [
  { id: 1, label: 'Mon' },
  { id: 2, label: 'Tue' },
  { id: 3, label: 'Wed' },
  { id: 4, label: 'Thu' },
  { id: 5, label: 'Fri' },
  { id: 6, label: 'Sat' },
  { id: 0, label: 'Sun' },
];

export const HabitModal: React.FC<HabitModalProps> = ({ isOpen, onClose, habitToEdit }) => {
  const { createHabit, updateHabit, isConnectedWithPartner } = useApp();

  const [name, setName] = useState(habitToEdit?.name || '');
  const [category, setCategory] = useState<HabitCategory>(habitToEdit?.category || 'health_fitness');
  const [description, setDescription] = useState(habitToEdit?.description || '');
  const [frequency, setFrequency] = useState<HabitFrequency>(habitToEdit?.frequency || 'daily');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(habitToEdit?.days_of_week || [0, 1, 2, 3, 4, 5, 6]);
  const [dailyTarget, setDailyTarget] = useState(habitToEdit?.daily_target || 1);
  const [targetUnit, setTargetUnit] = useState(habitToEdit?.target_unit || 'times');
  const [targetMinutes, setTargetMinutes] = useState(habitToEdit?.target_minutes || 0);
  const [isPrivate, setIsPrivate] = useState(habitToEdit?.is_private || false);
  const [isShared, setIsShared] = useState(habitToEdit?.is_shared ?? true);

  if (!isOpen) return null;

  const toggleDay = (day: number) => {
    if (daysOfWeek.includes(day)) {
      setDaysOfWeek(daysOfWeek.filter((d) => d !== day));
    } else {
      setDaysOfWeek([...daysOfWeek, day]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (habitToEdit) {
      updateHabit(habitToEdit.id, {
        name,
        category,
        description,
        frequency,
        days_of_week: daysOfWeek,
        daily_target: Number(dailyTarget),
        target_unit: targetUnit,
        target_minutes: targetMinutes ? Number(targetMinutes) : undefined,
        is_private: isPrivate,
        is_shared: isShared
      });
    } else {
      createHabit({
        name,
        category,
        description,
        frequency,
        days_of_week: daysOfWeek,
        daily_target: Number(dailyTarget),
        target_unit: targetUnit,
        target_minutes: targetMinutes ? Number(targetMinutes) : undefined,
        is_private: isPrivate,
        is_shared: isShared
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-white/[0.12] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <h3 className="text-lg font-bold text-white">
            {habitToEdit ? 'Edit Habit' : 'Create Personal Growth Habit'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Habit Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Solve 2 LeetCode Problems"
              className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as HabitCategory)}
              className="w-full bg-slate-900 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Description / Notes
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why this matters for your personal trajectory..."
              className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Cadence */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Cadence / Frequency
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['daily', 'weekly', 'custom_days', 'one_time'] as HabitFrequency[]).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setFrequency(freq)}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border capitalize text-center transition-all ${
                    frequency === freq
                      ? 'bg-indigo-600/30 border-indigo-500 text-white'
                      : 'bg-white/[0.02] border-white/[0.08] text-slate-400'
                  }`}
                >
                  {freq.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {frequency === 'custom_days' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Select Active Days
              </label>
              <div className="flex gap-1.5 justify-between">
                {WEEKDAYS.map((day) => {
                  const selected = daysOfWeek.includes(day.id);
                  return (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => toggleDay(day.id)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selected
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white/[0.04] text-slate-400 border border-white/[0.06]'
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Targets */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Target Quantity
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={dailyTarget}
                  onChange={(e) => setDailyTarget(Number(e.target.value))}
                  className="w-20 bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  value={targetUnit}
                  onChange={(e) => setTargetUnit(e.target.value)}
                  placeholder="e.g. problems"
                  className="flex-1 bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Target Minutes (Optional)
              </label>
              <input
                type="number"
                min="0"
                step="5"
                value={targetMinutes}
                onChange={(e) => setTargetMinutes(Number(e.target.value))}
                placeholder="e.g. 30"
                className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Privacy & Sharing Controls */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-medium text-white">Keep Strictly Private</span>
              </div>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded"
              />
            </div>

            {isConnectedWithPartner && (
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-medium text-white">Share Progress with Partner</span>
                </div>
                <input
                  type="checkbox"
                  checked={isShared && !isPrivate}
                  disabled={isPrivate}
                  onChange={(e) => setIsShared(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded disabled:opacity-50"
                />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-white/[0.02] border border-white/[0.08]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{habitToEdit ? 'Save Changes' : 'Create Habit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
