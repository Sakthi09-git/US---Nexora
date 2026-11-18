import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, 
  Plus, 
  Code, 
  GitBranch, 
  Award, 
  ExternalLink, 
  Trash2, 
  Rocket, 
  Briefcase, 
  CheckCircle2, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { CareerModal } from './CareerModal';
import { CareerActivity } from '../../types';

export const CareerGrowthView: React.FC = () => {
  const { state, currentUser, partnerUser, isConnectedWithPartner, deleteCareerActivity } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserFilter, setSelectedUserFilter] = useState<'both' | 'me' | 'partner'>('me');

  if (!currentUser) return null;

  // Filter activities
  const availableActivities = state.careerActivities.filter((act) => {
    if (act.user_id === currentUser.id) return true;
    if (partnerUser && isConnectedWithPartner && act.user_id === partnerUser.id) return true;
    return false;
  });

  const filteredActivities = availableActivities.filter((act) => {
    if (selectedUserFilter === 'me') return act.user_id === currentUser.id;
    if (selectedUserFilter === 'partner') return partnerUser ? act.user_id === partnerUser.id : false;
    return true;
  });

  // Calculate metrics for current user
  const userActivities = state.careerActivities.filter((a) => a.user_id === currentUser.id);

  const leetcodeCount = userActivities
    .filter((a) => a.activity_type === 'leetcode')
    .reduce((sum, a) => sum + a.metrics_value, 0);

  const githubCount = userActivities
    .filter((a) => a.activity_type === 'github')
    .reduce((sum, a) => sum + a.metrics_value, 0);

  const hackathonCount = userActivities.filter((a) => a.activity_type === 'hackathon').length;
  const certCount = userActivities.filter((a) => a.activity_type === 'certification').length;

  const codingScore = Math.min(30, Math.round(leetcodeCount * 0.4));
  const projectScore = Math.min(25, hackathonCount * 12 + certCount * 8);
  const gitScore = Math.min(25, Math.round(githubCount * 0.8));
  const activityScore = Math.min(20, userActivities.length * 3);
  const profileStrength = Math.min(95, codingScore + projectScore + gitScore + activityScore);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'leetcode':
        return <Code className="w-4 h-4 text-amber-400" />;
      case 'github':
        return <GitBranch className="w-4 h-4 text-emerald-400" />;
      case 'hackathon':
        return <Rocket className="w-4 h-4 text-rose-400" />;
      case 'certification':
        return <Award className="w-4 h-4 text-purple-400" />;
      case 'linkedin':
        return <Briefcase className="w-4 h-4 text-blue-400" />;
      default:
        return <GraduationCap className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Career Growth & Tech Portfolio</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track verified DSA problem solving, hackathons, and certifications in your private workspace.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Record Career Milestone</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
          <span className="text-xs text-slate-400 font-medium">LeetCode & DSA Solved</span>
          <div className="mt-2 text-2xl font-extrabold text-amber-400">
            {leetcodeCount} <span className="text-xs text-slate-400 font-normal">Problems</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Dynamic Programming, Graphs, Trees
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
          <span className="text-xs text-slate-400 font-medium">GitHub Contributions</span>
          <div className="mt-2 text-2xl font-extrabold text-emerald-400">
            {githubCount} <span className="text-xs text-slate-400 font-normal">Commits</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Active version control streak
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
          <span className="text-xs text-slate-400 font-medium">Hackathons & Projects</span>
          <div className="mt-2 text-2xl font-extrabold text-rose-400">
            {hackathonCount} <span className="text-xs text-slate-400 font-normal">Competitions</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Verified team project showcases
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
          <span className="text-xs text-slate-400 font-medium">Verified Certifications</span>
          <div className="mt-2 text-2xl font-extrabold text-purple-400">
            {certCount} <span className="text-xs text-slate-400 font-normal">Credentials</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Technical achievements
          </div>
        </div>
      </div>

      {/* Profile Strength Indicator */}
      <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Technical Profile Strength Assessment</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Calculated dynamically from verified evidence: DSA ({codingScore}/30), Projects ({projectScore}/25), Git ({gitScore}/25), Breadth ({activityScore}/20).
            </p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
              {profileStrength} / 100
            </span>
            <span className="text-xs font-semibold text-emerald-400">High Momentum</span>
          </div>
        </div>

        <div className="w-full bg-slate-800/80 h-3 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${profileStrength}%` }}
          />
        </div>

        <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center gap-2 text-[11px] text-slate-500">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>
            Note: This score reflects internal portfolio tracking completeness. It is a motivational benchmark and does not constitute a guaranteed placement or hiring outcome.
          </span>
        </div>
      </div>

      {/* Filter Tabs if partnered */}
      {isConnectedWithPartner && partnerUser && (
        <div className="flex items-center gap-2 p-1 rounded-xl glass-card w-fit border border-white/[0.08]">
          <button
            onClick={() => setSelectedUserFilter('me')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedUserFilter === 'me' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            My Milestones
          </button>
          <button
            onClick={() => setSelectedUserFilter('partner')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedUserFilter === 'partner' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {partnerUser.full_name.split(' ')[0]}'s Milestones
          </button>
          <button
            onClick={() => setSelectedUserFilter('both')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedUserFilter === 'both' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Combined Timeline
          </button>
        </div>
      )}

      {/* Timeline */}
      <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
        <h3 className="text-base font-bold text-white mb-6">Career Development Timeline</h3>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/[0.1]">
          {filteredActivities.map((act) => {
            const isMe = act.user_id === currentUser.id;
            const userObj = isMe ? currentUser : partnerUser;

            return (
              <div key={act.id} className="relative group">
                <div className="absolute -left-[27px] top-1 w-6 h-6 rounded-full bg-[#0F111A] border-2 border-purple-500/80 flex items-center justify-center shadow-sm">
                  {getActivityIcon(act.activity_type)}
                </div>

                <div className="p-4 rounded-xl glass-card border border-white/[0.06] hover:border-white/[0.12] transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-slate-300 font-mono">
                          {act.event_date}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          isMe ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {userObj?.full_name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 uppercase tracking-wider font-semibold">
                          {act.activity_type}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white mt-1.5">{act.title}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {act.proof_url && (
                        <a
                          href={act.proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg text-xs font-medium text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 flex items-center gap-1"
                        >
                          <span>Evidence</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      {isMe && (
                        <button
                          onClick={() => deleteCareerActivity(act.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete Milestone"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {act.description && (
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {act.description}
                    </p>
                  )}

                  {act.platform && (
                    <div className="mt-2 text-[11px] text-slate-500">
                      Platform: <span className="text-slate-400 font-medium">{act.platform}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredActivities.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              No milestones recorded yet. Add your first LeetCode or project achievement!
            </div>
          )}
        </div>
      </div>

      <CareerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
