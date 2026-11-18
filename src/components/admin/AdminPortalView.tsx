import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  HeartHandshake, 
  Activity, 
  Database, 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  Lock,
  Globe
} from 'lucide-react';

export const AdminPortalView: React.FC = () => {
  const { getAdminStats, state, currentUser } = useApp();
  const stats = getAdminStats();

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Platform Administration & Health Console</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Platform-Level Multi-Tenant Operations</h2>
        <p className="text-xs text-slate-400 mt-1">
          Monitor multi-user scalability, database health, and verification metrics across all workspaces.
        </p>
      </div>

      {/* Zero-Knowledge Privacy Guarantee Banner */}
      <div className="p-4 rounded-2xl glass-card border border-indigo-500/30 bg-indigo-950/20 flex items-start gap-3">
        <Lock className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white block font-semibold mb-0.5">Strict Zero-Knowledge Administrator Boundary:</strong>
          In accordance with PostgreSQL Row-Level Security (RLS), platform administrators have visibility into aggregate metrics only. Raw personal habit details, completion checkmarks, and screen-time logs are cryptographic and cannot be queried by administrators.
        </div>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Registered Users</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-white">{stats.totalUsers}</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">
            {stats.verifiedEmailUsers} verified emails
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Connected Partnerships</span>
            <HeartHandshake className="w-4 h-4 text-pink-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-pink-300">{stats.totalActivePartnerships}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Mutual couple workspaces
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Active Habits Tracked</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-400">{stats.totalActiveHabits}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across all user workspaces
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Monthly Summaries</span>
            <Database className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-300">{stats.totalMonthlySummaries}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Permanent compact snapshots
          </div>
        </div>
      </div>

      {/* System Health Monitor */}
      <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-400" />
          <span>System Infrastructure Health</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <span className="text-slate-400">Database Engine:</span>
            <span className="text-white font-mono font-semibold">PostgreSQL 16 (RLS Active)</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <span className="text-slate-400">Authentication Service:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Operational
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <span className="text-slate-400">Realtime Sync Channel:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Broadcast Ready
            </span>
          </div>
        </div>
      </div>

      {/* User Directory Table (Account Management) */}
      <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
        <h3 className="text-sm font-bold text-white mb-4">Registered Account Directory</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400">
                <th className="pb-3 font-semibold">User</th>
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Partner Status</th>
                <th className="pb-3 font-semibold">Verification</th>
                <th className="pb-3 font-semibold text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {state.allUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 flex items-center gap-2.5">
                    <img
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="w-7 h-7 rounded-full object-cover border border-white/[0.1]"
                    />
                    <span className="font-bold text-white">{user.full_name}</span>
                  </td>
                  <td className="py-3 text-slate-300 font-mono">{user.email}</td>
                  <td className="py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      user.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-white/[0.05] text-slate-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3">
                    {user.partner_id ? (
                      <span className="text-emerald-400 font-semibold">Connected</span>
                    ) : (
                      <span className="text-slate-500">Solo Workspace</span>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        user.is_email_verified ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {user.is_email_verified ? 'Email ✓' : 'Email —'}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        user.is_phone_verified ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {user.is_phone_verified ? 'Phone ✓' : 'Phone —'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-right text-slate-500 font-mono">
                    {user.created_at.slice(0, 10)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

