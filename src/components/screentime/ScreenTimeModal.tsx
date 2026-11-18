import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenTimeEntry } from '../../types';
import { X, Check, Smartphone } from 'lucide-react';

interface ScreenTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryDate?: string;
}

export const ScreenTimeModal: React.FC<ScreenTimeModalProps> = ({
  isOpen,
  onClose,
  entryDate
}) => {
  const { state, currentUser, saveScreenTime, todayDateStr } = useApp();

  if (!isOpen || !currentUser) return null;

  const targetDate = entryDate || todayDateStr;
  const existingEntry = state.screenTimeEntries.find(
    (e) => e.user_id === currentUser.id && e.entry_date === targetDate
  );

  const [socialMedia, setSocialMedia] = useState(existingEntry?.social_media_minutes || 0);
  const [entertainment, setEntertainment] = useState(existingEntry?.entertainment_minutes || 0);
  const [learning, setLearning] = useState(existingEntry?.learning_minutes || 0);
  const [coding, setCoding] = useState(existingEntry?.coding_minutes || 0);
  const [gaming, setGaming] = useState(existingEntry?.gaming_minutes || 0);
  const [other, setOther] = useState(existingEntry?.other_minutes || 0);
  const [notes, setNotes] = useState(existingEntry?.notes || '');

  const totalMinutes = socialMedia + entertainment + learning + coding + gaming + other;
  const productiveMinutes = learning + coding;
  const nonProductiveMinutes = socialMedia + entertainment + gaming;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveScreenTime({
      user_id: currentUser.id,
      entry_date: targetDate,
      social_media_minutes: Number(socialMedia),
      entertainment_minutes: Number(entertainment),
      learning_minutes: Number(learning),
      coding_minutes: Number(coding),
      gaming_minutes: Number(gaming),
      other_minutes: Number(other),
      notes
    });
    onClose();
  };

  const formatHoursMins = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-white/[0.12] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-bold text-white">Record Daily Screen Time</h3>
              <p className="text-xs text-slate-400">
                For {currentUser.full_name} • {targetDate}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Calculated Total</div>
              <div className="text-xl font-extrabold text-white">{formatHoursMins(totalMinutes)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-emerald-400 font-semibold">Productive: {formatHoursMins(productiveMinutes)}</div>
              <div className="text-xs text-amber-400 font-medium">Non-productive: {formatHoursMins(nonProductiveMinutes)}</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Productive & Growth Usage
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Coding & Productivity (mins)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={coding}
                  onChange={(e) => setCoding(Number(e.target.value))}
                  placeholder="e.g. 120"
                  className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Learning & Reading (mins)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={learning}
                  onChange={(e) => setLearning(Number(e.target.value))}
                  placeholder="e.g. 60"
                  className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider pt-2">
              Leisure & Media Usage
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Social Media (mins)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={socialMedia}
                  onChange={(e) => setSocialMedia(Number(e.target.value))}
                  placeholder="e.g. 45"
                  className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Goal: &lt; 60 mins</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Entertainment & Videos (mins)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={entertainment}
                  onChange={(e) => setEntertainment(Number(e.target.value))}
                  placeholder="e.g. 30"
                  className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Goal: &lt; 60 mins</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Gaming (mins)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={gaming}
                  onChange={(e) => setGaming(Number(e.target.value))}
                  placeholder="e.g. 0"
                  className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Other / Utility (mins)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={other}
                  onChange={(e) => setOther(Number(e.target.value))}
                  placeholder="e.g. 15"
                  className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Discipline Reflection / Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What helped you stay focused today?"
                className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
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
              <span>Save Entry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
