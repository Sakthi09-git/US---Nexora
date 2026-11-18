import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { publishInviteOffer } from '../../lib/cloudSync';
import { 
  X, 
  Send, 
  Copy, 
  Check, 
  Heart, 
  ShieldCheck, 
  UserX, 
  Mail, 
  Sparkles, 
  Users, 
  Search, 
  Share2, 
  Clock,
  KeyRound
} from 'lucide-react';

interface PartnerConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnerConnectionModal: React.FC<PartnerConnectionModalProps> = ({
  isOpen,
  onClose
}) => {
  const { 
    currentUser, 
    partnerUser, 
    isConnectedWithPartner, 
    activePartnership,
    sendPartnerInvitation,
    inviteUserById,
    connectByInviteCode,
    cancelInvitation,
    acceptPartnerInvitation, 
    rejectPartnerInvitation, 
    disconnectPartner,
    toggleShareProgress,
    pendingInvitationsReceived,
    pendingInvitationsSent,
    state
  } = useApp();

  const [activeTab, setActiveTab] = useState<'members' | 'link'>('members');
  const [memberSearch, setMemberSearch] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);

  if (!isOpen || !currentUser) return null;

  const myInviteCode = currentUser.invite_code || pendingInvitationsSent[0]?.invite_code || `NX-${currentUser.id.slice(-6).toUpperCase()}`;
  const myInviteLink = `${window.location.origin}/?join=${myInviteCode}&joinUser=${currentUser.id}`;

  // Broadcast invite code offer to Cloud Relay whenever modal is open
  useEffect(() => {
    if (isOpen && currentUser && myInviteCode) {
      publishInviteOffer(myInviteCode, currentUser);
    }
  }, [isOpen, currentUser?.id, myInviteCode]);

  const handleConnectByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    setFeedback({ success: true, message: 'Looking up partner code...' });
    const res = await connectByInviteCode(inputCode.trim());
    setFeedback(res);
    if (res.success) {
      setInputCode('');
      setTimeout(onClose, 1500);
    }
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const res = sendPartnerInvitation(inviteEmail.trim());
    setFeedback(res);
    if (res.success) setInviteEmail('');
  };

  const handleInviteMember = (targetUserId: string) => {
    const res = inviteUserById(targetUserId);
    setFeedback(res);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(myInviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Hey! Let's grow together on Nexora. Install the app and connect with me using my partner code: *${myInviteCode}*\n\nOr click your invite link:\n${myInviteLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleAccept = (invId: string) => {
    const res = acceptPartnerInvitation(invId);
    setFeedback(res);
    if (res.success) {
      setTimeout(onClose, 1500);
    }
  };

  // Filter application members excluding currentUser
  const otherMembers = state.allUsers.filter((u) => u.id !== currentUser.id);
  const filteredMembers = otherMembers.filter((u) => 
    u.full_name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-white/[0.12] p-6 shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
              <Heart className="w-5 h-5 fill-pink-400/20" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isConnectedWithPartner ? 'Partner Connection & Privacy' : 'Connect & Grow Together'}
              </h3>
              <p className="text-xs text-slate-400">Collaborate with your partner while maintaining privacy</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`p-3 rounded-xl mt-4 text-xs font-semibold border shrink-0 ${
            feedback.success
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          }`}>
            {feedback.message}
          </div>
        )}

        <div className="overflow-y-auto flex-1 pr-1 mt-4 space-y-4">
          
          {/* 1. CONNECTED STATE */}
          {isConnectedWithPartner && partnerUser ? (
            <div className="space-y-4">
              {/* Active Partner Card */}
              <div className="p-4 rounded-2xl glass-card border border-emerald-500/30 bg-emerald-950/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={partnerUser.avatar_url || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                    alt={partnerUser.full_name}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500/50"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white">{partnerUser.full_name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                        Connected Partner
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{partnerUser.email}</p>
                    <div className="text-[10px] text-slate-500 mt-0.5">Level {partnerUser.level} &bull; {partnerUser.xp_points} XP</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm text-amber-400 font-bold block">
                    {activePartnership?.shared_streak || 1}d Streak 🔥
                  </span>
                  <span className="text-[10px] text-slate-500">Couple Synergy</span>
                </div>
              </div>

              {/* Privacy Controls */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>Explicit Sharing Permissions</span>
                </h4>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="text-xs font-medium text-white">Share Habit Completion % with Partner</div>
                    <p className="text-[11px] text-slate-400">Allows your partner to view your overall consistency in synergy rings.</p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleShareProgress}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      currentUser.share_progress_with_partner ? 'bg-indigo-600' : 'bg-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      currentUser.share_progress_with_partner ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 pt-2 border-t border-white/[0.04]">
                  Zero-Knowledge Guarantee: Habits marked "Private" and all raw screen-time logs are <strong>never</strong> shared with your partner.
                </p>
              </div>

              {/* Disconnect Partner */}
              <div className="pt-2 border-t border-white/[0.06]">
                {confirmDisconnect ? (
                  <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2.5">
                    <p className="text-xs text-rose-300 font-semibold">
                      Are you sure? Disconnecting will return both of you to independent personal dashboards. All personal habits, XP, and monthly summaries remain 100% safe.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmDisconnect(false)}
                        className="px-3 py-1.5 rounded-lg text-xs text-slate-300 bg-white/[0.05]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          disconnectPartner();
                          setConfirmDisconnect(false);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500"
                      >
                        Confirm Disconnect
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDisconnect(true)}
                    className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition-colors"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Disconnect Partner</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* 2. SOLO STATE: TABS FOR INVITING MEMBERS OR SHARING LINK */
            <div className="space-y-4">
              
              {/* Received Pending Invitations Alert */}
              {pendingInvitationsReceived.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Partner Request Waiting ({pendingInvitationsReceived.length})
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {pendingInvitationsReceived.map((inv) => (
                      <div key={inv.id} className="p-3 rounded-xl bg-black/40 border border-amber-500/30 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white">{inv.sender_name}</div>
                          <div className="text-[11px] text-slate-400">{inv.sender_email}</div>
                          <div className="text-[10px] text-amber-400 font-mono mt-0.5">Code: {inv.invite_code}</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => rejectPartnerInvitation(inv.id)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-white/[0.04]"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleAccept(inv.id)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30 flex items-center gap-1"
                          >
                            <Heart className="w-3.5 h-3.5 fill-white" />
                            <span>Accept</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-tabs */}
              <div className="flex p-1 rounded-xl bg-black/40 border border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setActiveTab('members')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'members'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Application Members ({otherMembers.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('link')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'link'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Invite Link &amp; Code</span>
                </button>
              </div>

              {/* TAB 1: MEMBERS IN THE APPLICATION */}
              {activeTab === 'members' && (
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      placeholder="Search registered members by name or email..."
                      className="w-full bg-black/40 border border-white/[0.1] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {filteredMembers.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        No registered members found matching "{memberSearch}". You can also invite by direct email or share your invite link.
                      </div>
                    ) : (
                      filteredMembers.map((member) => {
                        const hasReceivedInviteFromThem = pendingInvitationsReceived.some(
                          (i) => i.sender_user_id === member.id
                        );
                        const hasSentInviteToThem = pendingInvitationsSent.some(
                          (i) => i.receiver_email.toLowerCase() === member.email.toLowerCase()
                        );
                        const isMemberPartnered = Boolean(member.partner_id);

                        return (
                          <div
                            key={member.id}
                            className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] flex items-center justify-between transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={member.avatar_url || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                                alt={member.full_name}
                                className="w-9 h-9 rounded-xl object-cover border border-white/[0.1]"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="text-xs font-bold text-white">{member.full_name}</h5>
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300 font-mono">
                                    Lv {member.level}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400">{member.email}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {hasReceivedInviteFromThem ? (
                                <button
                                  onClick={() => {
                                    const inv = pendingInvitationsReceived.find((i) => i.sender_user_id === member.id);
                                    if (inv) handleAccept(inv.id);
                                  }}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm"
                                >
                                  Accept Request
                                </button>
                              ) : hasSentInviteToThem ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>Invited</span>
                                  </span>
                                  <button
                                    onClick={() => {
                                      const inv = pendingInvitationsSent.find(
                                        (i) => i.receiver_email.toLowerCase() === member.email.toLowerCase()
                                      );
                                      if (inv) cancelInvitation(inv.id);
                                    }}
                                    className="text-[10px] text-slate-400 hover:text-rose-400 p-1"
                                    title="Cancel Invitation"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : isMemberPartnered ? (
                                <span className="text-[10px] text-slate-500 bg-white/[0.02] border border-white/[0.04] px-2 py-1 rounded-lg">
                                  Already Partnered
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleInviteMember(member.id)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm flex items-center gap-1"
                                >
                                  <Heart className="w-3 h-3" />
                                  <span>Connect</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: INVITE LINK & EMAIL */}
              {activeTab === 'link' && (
                <div className="space-y-4">
                  {/* Direct Link Sharing */}
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white font-semibold">Your Personal Growth Link</span>
                      <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        Code: {myInviteCode}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Send this link to your partner. When they open it, they can register or sign in and will be instantly paired with you!
                    </p>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={handleCopyLink}
                        className="flex-1 py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/[0.08] transition-all"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy Link'}</span>
                      </button>

                      <button
                        onClick={handleWhatsAppShare}
                        className="py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-emerald-500/30 transition-all"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share on WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  {/* Connect with Partner Invite Code */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-pink-950/20 to-indigo-950/20 border border-pink-500/20 space-y-2">
                    <div className="flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-pink-400" />
                      <span className="text-xs text-white font-semibold">Have a Partner Invite Code?</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      If your partner gave you their invite code (e.g. NX-XXXXXX), enter it below to connect instantly.
                    </p>
                    <form onSubmit={handleConnectByCode} className="flex gap-2 pt-1">
                      <input
                        type="text"
                        required
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                        placeholder="e.g. NX-A7B2C9"
                        className="flex-1 bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white font-mono uppercase tracking-wider focus:outline-none focus:border-pink-500 placeholder-slate-600"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 shadow-md shadow-pink-600/20"
                      >
                        <Heart className="w-3.5 h-3.5 fill-white" />
                        <span>Pair Up</span>
                      </button>
                    </form>
                  </div>

                  {/* Send Email Invitation */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Or Invite by Email Address
                    </h4>
                    <form onSubmit={handleSendInvite} className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="email"
                          required
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="partner@example.com"
                          className="w-full bg-black/40 border border-white/[0.1] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 shadow-md shadow-indigo-600/30"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send</span>
                      </button>
                    </form>
                  </div>

                  {/* Sent Invitations List */}
                  {pendingInvitationsSent.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Sent Invitations ({pendingInvitationsSent.length})
                      </h4>
                      <div className="space-y-1.5">
                        {pendingInvitationsSent.map((inv) => (
                          <div key={inv.id} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center justify-between text-xs">
                            <span className="text-slate-300">{inv.receiver_email}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                                {inv.invite_code}
                              </span>
                              <button
                                onClick={() => cancelInvitation(inv.id)}
                                className="text-[10px] text-slate-500 hover:text-rose-400"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
