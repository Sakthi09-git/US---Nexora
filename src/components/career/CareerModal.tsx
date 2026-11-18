import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CareerActivity, CareerActivityType } from '../../types';
import { X, Check, GraduationCap, Link2 } from 'lucide-react';

interface CareerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACTIVITY_TYPES: { id: CareerActivityType; label: string }[] = [
  { id: 'leetcode', label: 'LeetCode Problem Solving' },
  { id: 'skillrack', label: 'SkillRack Practice / Milestone' },
  { id: 'github', label: 'GitHub Repository / Commits' },
  { id: 'hackathon', label: 'Hackathon Participation / Win' },
  { id: 'certification', label: 'Technical Certification' },
  { id: 'project', label: 'Real-world Project Shipped' },
  { id: 'workshop', label: 'Workshop / Technical Seminar' },
  { id: 'linkedin', label: 'LinkedIn Post / Network Milestone' },
  { id: 'internship', label: 'Internship / Job Application' },
  { id: 'skill', label: 'New Technical Skill Mastered' }
];

export const CareerModal: React.FC<CareerModalProps> = ({ isOpen, onClose }) => {
  const { addCareerActivity, currentUser, todayDateStr } = useApp();

  const [title, setTitle] = useState('');
  const [activityType, setActivityType] = useState<CareerActivityType>('leetcode');
  const [platform, setPlatform] = useState('LeetCode');
  const [description, setDescription] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [metricsValue, setMetricsValue] = useState(1);
  const [eventDate, setEventDate] = useState(todayDateStr);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addCareerActivity({
      user_id: currentUser.id,
      activity_type: activityType,
      title: title.trim(),
      platform: platform.trim(),
      description: description.trim(),
      proof_url: proofUrl.trim(),
      metrics_value: Number(metricsValue) || 1,
      event_date: eventDate
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-white/[0.12] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-base font-bold text-white">Record Career Milestone</h3>
              <p className="text-xs text-slate-400">Add verified technical achievement for {currentUser.full_name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Milestone / Activity Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Solved 10 Graph & DP Problems"
              className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value as CareerActivityType)}
                className="w-full bg-slate-900 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {ACTIVITY_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Platform / Organization
              </label>
              <input
                type="text"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                placeholder="e.g. LeetCode, GitHub, Devpost"
                className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Quantity / Metrics
              </label>
              <input
                type="number"
                min="1"
                value={metricsValue}
                onChange={(e) => setMetricsValue(Number(e.target.value))}
                placeholder="e.g. 10 problems or 1 win"
                className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Event Date
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-slate-900 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Description & Learnings
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What core concepts were reinforced? What was achieved?"
              className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Verification Proof URL (Optional)
            </label>
            <div className="relative">
              <input
                type="url"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                placeholder="https://github.com/... or https://devpost.com/..."
                className="w-full bg-black/40 border border-white/[0.1] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
              <Link2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
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
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/30 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Record (+50 XP)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
