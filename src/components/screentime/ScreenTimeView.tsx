import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Smartphone, 
  Plus, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  Info, 
  Clock,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  AreaChart, 
  Area 
} from 'recharts';
import { ScreenTimeModal } from './ScreenTimeModal';

export const ScreenTimeView: React.FC = () => {
  const { state, currentUser, partnerUser, isConnectedWithPartner, todayDateStr } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateForEdit, setSelectedDateForEdit] = useState<string>(todayDateStr);

  if (!currentUser) return null;

  const formatHoursMins = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  // Current user's screen time entries
  const userEntries = state.screenTimeEntries
    .filter((e) => e.user_id === currentUser.id)
    .sort((a, b) => b.entry_date.localeCompare(a.entry_date));

  const partnerEntries = partnerUser && isConnectedWithPartner
    ? state.screenTimeEntries.filter((e) => e.user_id === partnerUser.id).sort((a, b) => b.entry_date.localeCompare(a.entry_date))
    : [];

  const todayUserEntry = userEntries.find((e) => e.entry_date === todayDateStr);
  const todayPartnerEntry = partnerEntries.find((e) => e.entry_date === todayDateStr);

  const totalUserMins = userEntries.reduce((sum, e) => sum + e.total_minutes, 0);
  const userAvgDailyMins = userEntries.length > 0 ? Math.round(totalUserMins / userEntries.length) : 0;

  const totalProductiveMins = userEntries.reduce(
    (sum, e) => sum + e.coding_minutes + e.learning_minutes,
    0
  );
  const productiveRatio = totalUserMins > 0 ? Math.round((totalProductiveMins / totalUserMins) * 100) : 0;

  const chartData = userEntries.slice(0, 10).reverse().map((entry) => {
    const pEntry = partnerEntries.find((p) => p.entry_date === entry.entry_date);
    return {
      date: entry.entry_date.slice(5),
      coding: Math.round(entry.coding_minutes / 60 * 10) / 10,
      learning: Math.round(entry.learning_minutes / 60 * 10) / 10,
      social: Math.round(entry.social_media_minutes / 60 * 10) / 10,
      entertainment: Math.round(entry.entertainment_minutes / 60 * 10) / 10,
      myProductive: Math.round((entry.coding_minutes + entry.learning_minutes) / 60 * 10) / 10,
      partnerProductive: pEntry ? Math.round((pEntry.coding_minutes + pEntry.learning_minutes) / 60 * 10) / 10 : 0
    };
  });

  const handleEditDate = (dateStr: string) => {
    setSelectedDateForEdit(dateStr);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Screen Time & Digital Discipline</h2>
          <p className="text-xs text-slate-400 mt-1">
            Zero-Knowledge Private: Your detailed logs are visible only in your authenticated workspace.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedDateForEdit(todayDateStr);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Log Screen Time</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
          <span className="text-xs text-slate-400 font-medium">My Screen Time Today</span>
          <div className="mt-2 text-2xl font-extrabold text-white">
            {todayUserEntry ? formatHoursMins(todayUserEntry.total_minutes) : 'Not Logged'}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">
            {todayUserEntry ? `${formatHoursMins(todayUserEntry.coding_minutes + todayUserEntry.learning_minutes)} productive` : '—'}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
          <span className="text-xs text-slate-400 font-medium">
            {isConnectedWithPartner && partnerUser ? `${partnerUser.full_name.split(' ')[0]}'s Screen Time` : 'Daily Average'}
          </span>
          <div className="mt-2 text-2xl font-extrabold text-indigo-300">
            {isConnectedWithPartner && partnerUser 
              ? (todayPartnerEntry ? formatHoursMins(todayPartnerEntry.total_minutes) : 'Not Logged')
              : formatHoursMins(userAvgDailyMins)
            }
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {isConnectedWithPartner && partnerUser ? 'Partner daily total' : 'Overall personal daily average'}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
          <span className="text-xs text-slate-400 font-medium">Productive Ratio</span>
          <div className="mt-2 text-2xl font-extrabold text-emerald-400">
            {productiveRatio}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Coding + Learning vs Total
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
          <span className="text-xs text-slate-400 font-medium">Discipline Status</span>
          <div className="mt-2 text-2xl font-extrabold text-purple-300">
            Healthy
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            Within personal goals
          </div>
        </div>
      </div>

      {/* Target Goals Card */}
      <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Active Discipline Targets</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Social Media Target</div>
              <div className="text-sm font-bold text-white mt-0.5">&lt; 1 Hour / Day</div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">
              Active
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Entertainment Limit</div>
              <div className="text-sm font-bold text-white mt-0.5">&lt; 1 Hour / Day</div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">
              Active
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Productive Target</div>
              <div className="text-sm font-bold text-white mt-0.5">&gt; 3 Hours / Day</div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">
              Target
            </span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
          <h3 className="text-sm font-bold text-white mb-1">
            Usage Breakdown by Category (Hours)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Recent daily distribution for your account.
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit="h" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F111A',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="coding" name="Coding" stackId="a" fill="#8B5CF6" />
                <Bar dataKey="learning" name="Learning" stackId="a" fill="#06B6D4" />
                <Bar dataKey="social" name="Social Media" stackId="a" fill="#F43F5E" />
                <Bar dataKey="entertainment" name="Entertainment" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
          <h3 className="text-sm font-bold text-white mb-1">
            {isConnectedWithPartner ? 'Productive Hours Comparison' : 'Productive Trend'}
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Deep focus trajectory on code & learning.
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMe" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit="h" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F111A',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="myProductive" name={`You (${currentUser.full_name.split(' ')[0]})`} stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorMe)" />
                {isConnectedWithPartner && partnerUser && (
                  <Area type="monotone" dataKey="partnerProductive" name={`Partner (${partnerUser.full_name.split(' ')[0]})`} stroke="#10B981" strokeWidth={2} />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Screen Time Table */}
      <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
        <h3 className="text-sm font-bold text-white mb-4">Historical Daily Entries (Active Month)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400">
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Total Time</th>
                <th className="pb-3 font-semibold">Coding / Work</th>
                <th className="pb-3 font-semibold">Learning</th>
                <th className="pb-3 font-semibold">Social Media</th>
                <th className="pb-3 font-semibold">Entertainment</th>
                <th className="pb-3 font-semibold">Notes</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {userEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 font-mono font-medium text-white">{entry.entry_date}</td>
                  <td className="py-3 font-bold text-slate-200">{formatHoursMins(entry.total_minutes)}</td>
                  <td className="py-3 text-purple-400 font-semibold">{formatHoursMins(entry.coding_minutes)}</td>
                  <td className="py-3 text-cyan-400">{formatHoursMins(entry.learning_minutes)}</td>
                  <td className="py-3 text-rose-400">{formatHoursMins(entry.social_media_minutes)}</td>
                  <td className="py-3 text-amber-400">{formatHoursMins(entry.entertainment_minutes)}</td>
                  <td className="py-3 text-slate-400 max-w-xs truncate">{entry.notes || '—'}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleEditDate(entry.entry_date)}
                      className="px-2 py-1 rounded text-[11px] font-medium text-indigo-400 hover:text-indigo-300 hover:bg-white/[0.04]"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ScreenTimeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        entryDate={selectedDateForEdit}
      />
    </div>
  );
};
