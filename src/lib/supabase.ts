import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User, Partnership, PartnerInvitation } from '../types';

const STORAGE_URL_KEY = 'nexora_supabase_url';
const STORAGE_ANON_KEY = 'nexora_supabase_anon_key';

export function getSupabaseCredentials(): { url: string; key: string } {
  try {
    const storedUrl = localStorage.getItem(STORAGE_URL_KEY);
    const storedKey = localStorage.getItem(STORAGE_ANON_KEY);
    if (storedUrl && storedKey) {
      return { url: storedUrl.trim(), key: storedKey.trim() };
    }
  } catch {
    // Ignore in non-browser env
  }

  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();
  return { url: envUrl, key: envKey };
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key && !url.includes('your-supabase-url') && !url.includes('your-project-id'));
}

let cachedClient: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key } = getSupabaseCredentials();
  if (!url || !key || url.includes('your-supabase-url')) return null;

  if (cachedClient && lastUrl === url && lastKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true }
    });
    lastUrl = url;
    lastKey = key;
    return cachedClient;
  } catch (err) {
    console.error('[Supabase] Failed to init client:', err);
    return null;
  }
}

export function saveSupabaseConfig(url: string, key: string): boolean {
  try {
    localStorage.setItem(STORAGE_URL_KEY, url.trim());
    localStorage.setItem(STORAGE_ANON_KEY, key.trim());
    cachedClient = null; // force re-creation
    return true;
  } catch {
    return false;
  }
}

export function clearSupabaseConfig(): void {
  try {
    localStorage.removeItem(STORAGE_URL_KEY);
    localStorage.removeItem(STORAGE_ANON_KEY);
    cachedClient = null;
  } catch {
    // Ignore
  }
}

// -------------------------------------------------------------
// CLOUD DATABASE OPERATIONS
// -------------------------------------------------------------

/**
 * Searches users across all devices in the cloud database by name or email.
 */
export async function searchCloudUsers(query: string, currentUserId?: string): Promise<User[]> {
  const client = getSupabaseClient();
  if (!client || !query.trim()) return [];

  const clean = query.trim();
  try {
    // Query profiles table
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .or(`full_name.ilike.%${clean}%,email.ilike.%${clean}%`)
      .limit(20);

    if (error || !data) {
      console.warn('[Supabase] Error searching users:', error);
      return [];
    }

    return data
      .filter((u: any) => !currentUserId || u.id !== currentUserId)
      .map((u: any) => ({
        id: u.id,
        email: u.email,
        full_name: u.full_name,
        role: u.role || 'user',
        timezone: u.timezone || 'Asia/Kolkata',
        xp_points: u.xp_points || 0,
        level: u.level || 1,
        is_email_verified: Boolean(u.is_email_verified),
        is_phone_verified: Boolean(u.is_phone_verified),
        partner_id: u.partner_id || null,
        partnership_id: u.partnership_id || null,
        share_progress_with_partner: u.share_progress_with_partner ?? true,
        invite_code: u.invite_code || `NX-${u.id.slice(-6).toUpperCase()}`,
        avatar_url: u.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.full_name)}`,
        created_at: u.created_at || new Date().toISOString()
      }));
  } catch (err) {
    console.error('[Supabase] searchCloudUsers error:', err);
    return [];
  }
}

/**
 * Upserts a registered user's profile to the cloud database.
 */
export async function syncUserToCloud(user: User): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const payload = {
      id: user.id,
      email: user.email.toLowerCase(),
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      role: user.role,
      timezone: user.timezone,
      xp_points: user.xp_points,
      level: user.level,
      is_email_verified: user.is_email_verified,
      is_phone_verified: user.is_phone_verified,
      partner_id: user.partner_id || null,
      partnership_id: user.partnership_id || null,
      share_progress_with_partner: user.share_progress_with_partner,
      updated_at: new Date().toISOString()
    };

    const { error } = await client
      .from('profiles')
      .upsert(payload, { onConflict: 'email' });

    if (error) {
      console.warn('[Supabase] Failed to upsert user profile:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] syncUserToCloud error:', err);
    return false;
  }
}

/**
 * Sends a partner invitation in the cloud database.
 */
export async function sendCloudInvitation(inv: PartnerInvitation): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('partner_invitations')
      .insert({
        id: inv.id,
        sender_user_id: inv.sender_user_id,
        sender_name: inv.sender_name,
        sender_email: inv.sender_email.toLowerCase(),
        receiver_email: inv.receiver_email.toLowerCase(),
        invite_code: inv.invite_code,
        status: inv.status,
        created_at: inv.created_at
      });

    return !error;
  } catch (err) {
    return false;
  }
}

/**
 * Fetches pending invitations for a user by email.
 */
export async function fetchCloudInvitations(userEmail: string): Promise<PartnerInvitation[]> {
  const client = getSupabaseClient();
  if (!client || !userEmail) return [];

  try {
    const { data, error } = await client
      .from('partner_invitations')
      .select('*')
      .eq('receiver_email', userEmail.toLowerCase())
      .eq('status', 'pending');

    if (error || !data) return [];
    return data.map((d: any) => ({
      id: d.id,
      sender_user_id: d.sender_user_id,
      sender_name: d.sender_name,
      sender_email: d.sender_email,
      receiver_email: d.receiver_email,
      invite_code: d.invite_code,
      status: d.status,
      created_at: d.created_at
    }));
  } catch {
    return [];
  }
}

/**
 * Accepts an invitation in the cloud database and creates the partnership.
 */
export async function acceptCloudInvitation(
  invitationId: string, 
  userAId: string, 
  userBId: string
): Promise<Partnership | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const partId = `part-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];

    // 1. Mark invitation accepted
    await client
      .from('partner_invitations')
      .update({ status: 'accepted', responded_at: new Date().toISOString() })
      .eq('id', invitationId);

    // 2. Insert partnership
    const { data, error } = await client
      .from('partnerships')
      .insert({
        id: partId,
        user_a_id: userAId,
        user_b_id: userBId,
        anniversary_date: today,
        shared_streak: 1,
        best_shared_streak: 1,
        status: 'active',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error || !data) return null;

    // 3. Link profiles
    await client.from('profiles').update({ partner_id: userBId, partnership_id: partId }).eq('id', userAId);
    await client.from('profiles').update({ partner_id: userAId, partnership_id: partId }).eq('id', userBId);

    return {
      id: data.id,
      user_a_id: data.user_a_id,
      user_b_id: data.user_b_id,
      anniversary_date: data.anniversary_date,
      shared_streak: data.shared_streak,
      best_shared_streak: data.best_shared_streak,
      status: data.status,
      created_at: data.created_at
    };
  } catch (err) {
    console.error('[Supabase] acceptCloudInvitation error:', err);
    return null;
  }
}

/**
 * Disconnects partners in the cloud database.
 */
export async function disconnectCloudPartner(userId: string, partnerId: string, partnershipId: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    await client.from('partnerships').update({ status: 'disconnected' }).eq('id', partnershipId);
    await client.from('profiles').update({ partner_id: null, partnership_id: null }).eq('id', userId);
    await client.from('profiles').update({ partner_id: null, partnership_id: null }).eq('id', partnerId);
  } catch (err) {
    console.error('[Supabase] disconnectCloudPartner error:', err);
  }
}
