import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Calendar, 
  Award, 
  Code, 
  Zap, 
  Smartphone, 
  CheckCircle2, 
  Printer,
  Sparkles,
  Heart
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const AnalyticsView: React.FC = () => {
  const { 
    state, 
    currentUser, 
    partnerUser, 
    isConnectedWithPartner,
    selectedCycle, 
    getMonthConsistencyScore,
    todayDateStr
  } = useApp();

  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!currentUser) return null;

  const consistencyScore = getMonthConsistencyScore(state.selectedMonthYear);

  // 1. Calculate Habit Completion Trends over the past 14 days
  const completionTrendsData = [];
  for (let i = 13; i >= 0; i--) {
    const day = 18 - i;
    const dateStr = `2026-11-${day < 10 ? '0' + day : day}`;
    const userCompletions = state.habitCompletions.filter(
      (c) => c.user_id === currentUser.id && c.completion_date === dateStr && c.is_completed
    ).length;
    const partnerCompletions = partnerUser ? state.habitCompletions.filter(
      (c) => c.user_id === partnerUser.id && c.completion_date === dateStr && c.is_completed
    ).length : 0;

    completionTrendsData.push({
      date: `Nov ${day}`,
      me: userCompletions,
      partner: partnerCompletions,
      combined: userCompletions + partnerCompletions
    });
  }

  // 2. Category Breakdown Data for current user
  const categoryCounts: { [key: string]: number } = {
    'Health & Fitness': 0,
    'Technical Development': 0,
    'Professional & Career': 0,
    'Academic Development': 0,
    'Personal Development': 0
  };

  state.habitCompletions.forEach((comp) => {
    if (comp.user_id === currentUser.id && comp.completion_date.startsWith('2026-11')) {
      const habit = state.habits.find((h) => h.id === comp.habit_id);
      if (habit) {
        if (habit.category === 'health_fitness') categoryCounts['Health & Fitness']++;
        else if (habit.category === 'technical_development') categoryCounts['Technical Development']++;
        else if (habit.category === 'professional_development' || habit.category === 'career_opportunities')
          categoryCounts['Professional & Career']++;
        else if (habit.category === 'academic_development') categoryCounts['Academic Development']++;
        else categoryCounts['Personal Development']++;
      }
    }
  });

  const categoryPieData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#10B981', '#8B5CF6', '#F59E0B', '#3B82F6', '#EC4899'];

  const totalCompletionsThisMonth = state.habitCompletions.filter((c) =>
    c.user_id === currentUser.id && c.completion_date.startsWith('2026-11')
  ).length;

  const leetcodeCount = state.careerActivities
    .filter((a) => a.user_id === currentUser.id && a.activity_type === 'leetcode')
    .reduce((sum, a) => sum + a.metrics_value, 0);

  const projectsCount = state.careerActivities.filter(
    (a) => a.user_id === currentUser.id && (a.activity_type === 'project' || a.activity_type === 'hackathon')
  ).length;

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#090A0F',
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Nexora_Growth_Report_${currentUser.full_name.replace(/\s+/g, '_')}_${state.selectedMonthYear}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Analytics & Monthly Dossiers</h2>
          <p className="text-xs text-slate-400 mt-1">
            Telemetry metrics for your personal workspace and partner synergy.
          </p>
        </div>

        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Generating PDF...' : 'Export Monthly PDF Report'}</span>
        </button>
      </div>

      {/* Printable Report Wrapper */}
      <div ref={reportRef} className="space-y-6 bg-[#090A0F] p-1 rounded-2xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
            <span className="text-xs text-slate-400 font-medium">Habits Completed (Nov)</span>
            <div className="mt-2 text-2xl font-extrabold text-white">
              {totalCompletionsThisMonth}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 font-semibold">
              Consistent daily momentum
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
            <span className="text-xs text-slate-400 font-medium">Monthly Consistency</span>
            <div className="mt-2 text-2xl font-extrabold text-emerald-400">
              {consistencyScore}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              November 2026 cycle
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
            <span className="text-xs text-slate-400 font-medium">LeetCode & DSA Problems</span>
            <div className="mt-2 text-2xl font-extrabold text-amber-400">
              {leetcodeCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Verified recorded problems
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
            <span className="text-xs text-slate-400 font-medium">Projects & Hackathons</span>
            <div className="mt-2 text-2xl font-extrabold text-purple-400">
              {projectsCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Active engineering portfolio
            </div>
          </div>
        </div>

        {/* Completion Trends Chart */}
        <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
          <h3 className="text-sm font-bold text-white mb-1">
            Habit Completion Trends (November 2026)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Daily consistency trajectory {isConnectedWithPartner && partnerUser ? `compared with ${partnerUser.full_name}` : 'for your personal workspace'}.
          </p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F111A',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="me"
                  name={`You (${currentUser.full_name.split(' ')[0]})`}
                  stroke="#8B5CF6"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                {isConnectedWithPartner && partnerUser && (
                  <Line
                    type="monotone"
                    dataKey="partner"
                    name={`Partner (${partnerUser.full_name.split(' ')[0]})`}
                    stroke="#10B981"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                )}
                {isConnectedWithPartner && (
                  <Line
                    type="monotone"
                    dataKey="combined"
                    name="Combined Couple Effort"
                    stroke="#F59E0B"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown & Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
            <h3 className="text-sm font-bold text-white mb-1">
              Category Distribution of Completed Habits
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Balance across technical, health, academic, and personal pillars.
            </p>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F111A',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/[0.08] flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Performance Dossier Summary</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Highlights from cycle: <strong className="text-white">{selectedCycle?.title}</strong>
              </p>

              <div className="mt-4 space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
                  <span className="text-slate-400">Best Performing Pillar:</span>
                  <span className="text-emerald-400 font-semibold">Health & Fitness</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
                  <span className="text-slate-400">Account Owner:</span>
                  <span className="text-purple-400 font-semibold">{currentUser.full_name}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
                  <span className="text-slate-400">Partner Status:</span>
                  <span className="text-cyan-400 font-semibold">
                    {isConnectedWithPartner && partnerUser ? `Connected with ${partnerUser.full_name}` : 'Solo Personal Space'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
                  <span className="text-slate-400">Discipline Level:</span>
                  <span className="text-amber-400 font-semibold">Level {currentUser.level} ({currentUser.xp_points} XP)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
              <span>Timezone: Asia/Kolkata</span>
              <span>Generated for {currentUser.full_name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
