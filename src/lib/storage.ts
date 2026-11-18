import { 
  User, 
  Partnership, 
  PartnerInvitation, 
  Habit, 
  HabitCompletion, 
  ScreenTimeEntry, 
  CareerActivity, 
  MonthlyCycle, 
  MonthlyGoal, 
  MonthlySummary, 
  Achievement, 
  UserAchievement, 
  EncouragementMessage, 
  AppNotification, 
  ScreenTimeGoals, 
  AdminSystemStats 
} from '../types';

const STORAGE_KEY = 'nexora_live_app_v2';
const SYNC_CHANNEL_NAME = 'nexora_multiuser_sync';
const SESSION_KEY = 'nexora_active_session_user';

export function generateInviteCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `NX-${code}`;
}

export function getActiveSessionUserId(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function setActiveSessionUserId(userId: string | null): void {
  try {
    if (userId) {
      sessionStorage.setItem(SESSION_KEY, userId);
      localStorage.setItem(SESSION_KEY, userId);
    } else {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // Ignore in non-browser env
  }
}

export interface AppState {
  allUsers: User[];
  currentUserId: string | null;
  partnerships: Partnership[];
  partnerInvitations: PartnerInvitation[];
  habits: Habit[];
  habitCompletions: HabitCompletion[];
  screenTimeEntries: ScreenTimeEntry[];
  screenTimeGoals: ScreenTimeGoals;
  careerActivities: CareerActivity[];
  monthlyCycles: MonthlyCycle[];
  monthlyGoals: MonthlyGoal[];
  monthlySummaries: MonthlySummary[];
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  encouragementMessages: EncouragementMessage[];
  notifications: AppNotification[];
  selectedMonthYear: string; // "2026-11"
}

export const TODAY_STR = '2026-11-18';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    code: 'first_day',
    title: 'First Day of Growth',
    description: 'Began your journey of intentional personal and career development.',
    category: 'habits',
    icon: 'HeartHandshake',
    xp_reward: 100,
    condition_type: 'first_day',
    condition_threshold: 1
  },
  {
    id: 'ach-2',
    code: 'discipline_7',
    title: '7-Day Discipline',
    description: 'Maintained habit consistency for 7 consecutive days.',
    category: 'habits',
    icon: 'Flame',
    xp_reward: 250,
    condition_type: 'streak',
    condition_threshold: 7
  },
  {
    id: 'ach-3',
    code: 'consistency_30',
    title: '30-Day Master',
    description: 'Completed full 30 days of dedicated monthly growth.',
    category: 'habits',
    icon: 'Trophy',
    xp_reward: 600,
    condition_type: 'streak',
    condition_threshold: 30
  },
  {
    id: 'ach-4',
    code: 'leetcode_100',
    title: '100 LeetCode Problems',
    description: 'Solved 100 technical coding interview problems.',
    category: 'career',
    icon: 'Code',
    xp_reward: 500,
    condition_type: 'leetcode_count',
    condition_threshold: 100
  },
  {
    id: 'ach-5',
    code: 'github_streak',
    title: 'GitHub Consistency',
    description: 'Recorded regular version control contributions.',
    category: 'career',
    icon: 'GitBranch',
    xp_reward: 300,
    condition_type: 'github_count',
    condition_threshold: 14
  },
  {
    id: 'ach-6',
    code: 'fitness_champ',
    title: 'Fitness Champion',
    description: 'Completed over 20 workouts in a single monthly cycle.',
    category: 'fitness',
    icon: 'Zap',
    xp_reward: 400,
    condition_type: 'workout_count',
    condition_threshold: 20
  },
  {
    id: 'ach-7',
    code: 'hackathon_hero',
    title: 'Hackathon Participant',
    description: 'Built and showcased an innovative real-world project at a hackathon.',
    category: 'career',
    icon: 'Rocket',
    xp_reward: 450,
    condition_type: 'hackathon_count',
    condition_threshold: 1
  },
  {
    id: 'ach-8',
    code: 'screen_master',
    title: 'Screen-Time Master',
    description: 'Kept non-productive screen time under 1.5 hours.',
    category: 'discipline',
    icon: 'ShieldCheck',
    xp_reward: 350,
    condition_type: 'screen_discipline',
    condition_threshold: 7
  }
];

export function getInitialDefaultState(): AppState {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const monthKey = `${year}-${month}`;

  const currentCycle: MonthlyCycle = {
    id: `cycle-${monthKey}`,
    user_id: 'system',
    month_year: monthKey,
    title: `${now.toLocaleString('default', { month: 'long' })} Growth Cycle`,
    theme_quote: 'Two individuals. One journey. Better every month.',
    start_date: `${year}-${month}-01`,
    end_date: `${year}-${month}-30`,
    target_score: 85,
    is_active: true,
    created_at: now.toISOString()
  };

  return {
    allUsers: [],
    currentUserId: null,
    partnerships: [],
    partnerInvitations: [],
    habits: [],
    habitCompletions: [],
    screenTimeEntries: [],
    screenTimeGoals: {
      max_social_media_minutes: 60,
      max_entertainment_minutes: 60,
      min_productive_minutes: 180
    },
    careerActivities: [],
    monthlyCycles: [currentCycle],
    monthlyGoals: [],
    monthlySummaries: [],
    achievements: INITIAL_ACHIEVEMENTS,
    userAchievements: [],
    encouragementMessages: [],
    notifications: [],
    selectedMonthYear: monthKey
  };
}

let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
  }
} catch {
  // Ignore in non-browser env
}

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialDefaultState();
      saveAppState(initial, false);
      return initial;
    }
    const parsed = JSON.parse(raw);

    // Sanitize any stale dummy users if present
    if (parsed.allUsers && Array.isArray(parsed.allUsers)) {
      const mockIds = new Set(['usr-alex-01', 'usr-sam-02', 'usr-maya-03']);
      const hasMock = parsed.allUsers.some((u: User) => mockIds.has(u.id) || u.email.endsWith('@growth.us'));
      if (hasMock) {
        parsed.allUsers = parsed.allUsers.filter((u: User) => !mockIds.has(u.id) && !u.email.endsWith('@growth.us'));
        parsed.habits = (parsed.habits || []).filter((h: Habit) => !mockIds.has(h.user_id));
        parsed.partnerships = (parsed.partnerships || []).filter(
          (p: Partnership) => !mockIds.has(p.user_a_id) && !mockIds.has(p.user_b_id)
        );
        parsed.partnerInvitations = (parsed.partnerInvitations || []).filter(
          (i: PartnerInvitation) => !mockIds.has(i.sender_user_id) && !i.sender_email?.endsWith('@growth.us')
        );
        if (parsed.currentUserId && mockIds.has(parsed.currentUserId)) {
          parsed.currentUserId = parsed.allUsers[0]?.id || null;
        }
      }
    }

    // If no users exist, currentUserId must be null
    if (!parsed.allUsers || parsed.allUsers.length === 0) {
      parsed.currentUserId = null;
      parsed.allUsers = [];
      setActiveSessionUserId(null);
    } else {
      // Use tab session if available to allow multiple tabs to be logged in as different users
      const sessionUser = getActiveSessionUserId();
      if (sessionUser && parsed.allUsers.some((u: User) => u.id === sessionUser)) {
        parsed.currentUserId = sessionUser;
      }
    }

    return parsed;
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
    return getInitialDefaultState();
  }
}

export function saveAppState(state: AppState, broadcast = true): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (state.currentUserId) {
      setActiveSessionUserId(state.currentUserId);
    }
    if (broadcast && broadcastChannel) {
      broadcastChannel.postMessage({ type: 'STATE_UPDATED', timestamp: Date.now() });
    }
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

export function subscribeToAppSync(onSync: () => void): () => void {
  if (!broadcastChannel) {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) onSync();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }

  const handler = (e: MessageEvent) => {
    if (e.data?.type === 'STATE_UPDATED') {
      onSync();
    }
  };
  broadcastChannel.addEventListener('message', handler);
  return () => {
    broadcastChannel?.removeEventListener('message', handler);
  };
}
