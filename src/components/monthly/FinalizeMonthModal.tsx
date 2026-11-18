import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Check, 
  Trash2, 
  Database, 
  CalendarRange, 
  RotateCw
} from 'lucide-react';

interface FinalizeMonthModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthYear?: string;
}

export const FinalizeMonthModal: React.FC<FinalizeMonthModalProps> = ({
  isOpen,
  onClose,
  monthYear
}) => {
  const { previewMonthFinalization, finalizeMonthCycle, isFinalizing, state, currentUser, partnerUser, isConnectedWithPartner } = useApp();
  const [resultMessage, setResultMessage] = useState<{ success: boolean; text: string } | null>(null);

  if (!isOpen || !currentUser) return null;

  const targetMonthYear = monthYear || state.selectedMonthYear;
  const preview = previewMonthFinalization(targetMonthYear);

  const formatHoursMins = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const handleConfirmFinalize = async () => {
    const res = await finalizeMonthCycle(targetMonthYear);
    setResultMessage({ success: res.success, text: res.message });
    if (res.success) {
      setTimeout(() => {
        setResultMessage(null);
        onClose();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-white/[0.12] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <CalendarRange className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Finalize Monthly Growth Snapshot</h3>
              <p className="text-xs text-slate-400">Minimal Monthly Data Retention Architecture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isFinalizing}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {resultMessage ? (
          <div className={`p-4 rounded-xl mt-4 border ${
            resultMessage.success 
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' 
              : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
          }`}>
            <p className="text-sm font-semibold">{resultMessage.text}</p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  <span>Permanent Compact Snapshot (Saved Forever)</span>
                </span>
                <span className="text-xs font-mono text-slate-400 font-bold">
                  {preview.monthName} {preview.year}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/10 border border-emerald-500/20 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Your ({currentUser.full_name}) Completion:</span>
                  <span className="font-extrabold text-purple-400 text-sm">{preview.user_pct}%</span>
                </div>

                {isConnectedWithPartner && partnerUser && (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">{partnerUser.full_name} Completion:</span>
                      <span className="font-extrabold text-emerald-400 text-sm">{preview.partner_pct}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-emerald-500/10">
                      <span className="text-white font-semibold">Combined Couple Completion:</span>
                      <span className="font-extrabold text-amber-400 text-base">{preview.couple_pct}%</span>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between text-xs pt-1 border-t border-white/[0.04]">
                  <span className="text-slate-400">Daily Screen Time Average:</span>
                  <span className="font-mono text-slate-300">{formatHoursMins(preview.user_screen_avg)}</span>
                </div>
              </div>
            </div>

            {/* Data Purge Notice */}
            <div className="p-3.5 rounded-xl bg-rose-950/10 border border-rose-500/20 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-rose-400 font-semibold">
                <Trash2 className="w-4 h-4 shrink-0" />
                <span>Temporary Records to be Purged:</span>
              </div>
              <p className="text-slate-300 leading-relaxed pl-6">
                All daily checkmarks ({preview.total_completions} habit records) and daily screen-time logs for {preview.monthName} {preview.year} will be permanently deleted from your active workspace.
              </p>
              <p className="text-slate-400 leading-relaxed pl-6">
                Your user account, habits, streak, and compact monthly summary will be preserved.
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isFinalizing}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-white/[0.02] border border-white/[0.08]"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleConfirmFinalize}
                disabled={isFinalizing}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
              >
                {isFinalizing ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Verifying & Purging...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Finalize & Roll Over Month</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
