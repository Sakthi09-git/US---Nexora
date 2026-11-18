import { User } from '../types';

export interface RemoteInvitePayload {
  type: 'INVITE_OFFER' | 'INVITE_ACCEPTED';
  inviteCode: string;
  sender?: User;
  receiver?: User;
  timestamp: number;
}

export interface RemoteProgressPayload {
  type: 'PROGRESS_UPDATE';
  partnershipId: string;
  userId: string;
  userName: string;
  dateStr: string;
  completedCount: number;
  totalCount: number;
  percent: number;
  streak: number;
  timestamp: number;
}

const NTFY_BASE = 'https://ntfy.sh';

function getChannel(key: string): string {
  // Clean channel name: only a-z, 0-9, and underscores
  const clean = key.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  return `nexora_cloud_${clean}`;
}

/**
 * Publishes an invite code offer to the global cloud relay so any phone can discover it.
 */
export async function publishInviteOffer(inviteCode: string, user: User): Promise<boolean> {
  try {
    const channel = getChannel(`invite_${inviteCode}`);
    const payload: RemoteInvitePayload = {
      type: 'INVITE_OFFER',
      inviteCode: inviteCode.trim().toUpperCase(),
      sender: user,
      timestamp: Date.now()
    };

    const res = await fetch(`${NTFY_BASE}/${channel}`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });
    return res.ok;
  } catch (err) {
    console.warn('[CloudSync] Failed to publish invite offer:', err);
    return false;
  }
}

/**
 * Searches the cloud relay for an invite code posted from another phone.
 */
export async function lookupRemoteInvite(inviteCode: string): Promise<User | null> {
  try {
    const clean = inviteCode.trim().toUpperCase();
    const channel = getChannel(`invite_${clean}`);
    const res = await fetch(`${NTFY_BASE}/${channel}/json?poll=1`);
    if (!res.ok) return null;

    const text = await res.text();
    const lines = text.trim().split('\n').filter(Boolean);
    
    // Read lines in reverse to find the latest valid INVITE_OFFER
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const item = JSON.parse(lines[i]);
        const msg: RemoteInvitePayload = typeof item.message === 'string' ? JSON.parse(item.message) : item.message;
        if (msg && msg.type === 'INVITE_OFFER' && msg.sender) {
          return msg.sender;
        }
      } catch {
        // Skip malformed line
      }
    }
    return null;
  } catch (err) {
    console.warn('[CloudSync] Remote invite lookup failed:', err);
    return null;
  }
}

/**
 * Sends an acceptance signal from the recipient's phone back to the sender's phone.
 */
export async function acceptRemoteInvite(inviteCode: string, receiver: User): Promise<boolean> {
  try {
    const channel = getChannel(`invite_${inviteCode}`);
    const payload: RemoteInvitePayload = {
      type: 'INVITE_ACCEPTED',
      inviteCode: inviteCode.trim().toUpperCase(),
      receiver,
      timestamp: Date.now()
    };

    const res = await fetch(`${NTFY_BASE}/${channel}`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });
    return res.ok;
  } catch (err) {
    console.warn('[CloudSync] Failed to accept remote invite:', err);
    return false;
  }
}

/**
 * Sender checks if someone accepted their invite code.
 */
export async function checkInviteAcceptance(inviteCode: string): Promise<User | null> {
  try {
    const clean = inviteCode.trim().toUpperCase();
    const channel = getChannel(`invite_${clean}`);
    const res = await fetch(`${NTFY_BASE}/${channel}/json?poll=1`);
    if (!res.ok) return null;

    const text = await res.text();
    const lines = text.trim().split('\n').filter(Boolean);

    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const item = JSON.parse(lines[i]);
        const msg: RemoteInvitePayload = typeof item.message === 'string' ? JSON.parse(item.message) : item.message;
        if (msg && msg.type === 'INVITE_ACCEPTED' && msg.receiver) {
          return msg.receiver;
        }
      } catch {
        // Skip
      }
    }
    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Publishes daily habit progress for partner's phone to render.
 */
export async function publishPartnerProgress(partnershipId: string, progress: {
  userId: string;
  userName: string;
  dateStr: string;
  completedCount: number;
  totalCount: number;
  percent: number;
  streak: number;
}): Promise<void> {
  try {
    const channel = getChannel(`progress_${partnershipId}`);
    const payload: RemoteProgressPayload = {
      type: 'PROGRESS_UPDATE',
      partnershipId,
      ...progress,
      timestamp: Date.now()
    };

    await fetch(`${NTFY_BASE}/${channel}`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    // Non-blocking
  }
}

/**
 * Polls partner's latest progress snapshot from the cloud relay.
 */
export async function fetchPartnerProgress(partnershipId: string): Promise<RemoteProgressPayload | null> {
  try {
    const channel = getChannel(`progress_${partnershipId}`);
    const res = await fetch(`${NTFY_BASE}/${channel}/json?poll=1`);
    if (!res.ok) return null;

    const text = await res.text();
    const lines = text.trim().split('\n').filter(Boolean);
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const item = JSON.parse(lines[i]);
        const msg: RemoteProgressPayload = typeof item.message === 'string' ? JSON.parse(item.message) : item.message;
        if (msg && msg.type === 'PROGRESS_UPDATE') {
          return msg;
        }
      } catch {
        // Skip
      }
    }
    return null;
  } catch {
    return null;
  }
}
