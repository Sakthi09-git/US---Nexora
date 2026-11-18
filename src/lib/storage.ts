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

const STORAGE_KEY = 'nexora_platform_v1';
const LEGACY_STORAGE_KEY = 'us_grow_together_multiuser_platform_v3';
const SYNC_CHANNEL_NAME = 'nexora_multiuser_sync';

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
  const userAlex: User = {
    id: 'usr-alex-01',
    email: 'alex@growth.us',
    full_name: 'Alex Rivera',
    phone_number: '+91 98765 43210',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    timezone: 'Asia/Kolkata',
    xp_points: 1450,
    level: 4,
    is_email_verified: true,
    is_phone_verified: true,
    partner_id: 'usr-sam-02',
    partnership_id: 'part-01',
    share_progress_with_partner: true,
    password: 'password123',
    created_at: '2026-10-01T00:00:00Z'
  };

  const userSam: User = {
    id: 'usr-sam-02',
    email: 'sam@growth.us',
    full_name: 'Sam Chen',
    phone_number: '+91 98765 12345',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    timezone: 'Asia/Kolkata',
    xp_points: 1620,
    level: 5,
    is_email_verified: true,
    is_phone_verified: true,
    partner_id: 'usr-alex-01',
    partnership_id: 'part-01',
    share_progress_with_partner: true,
    password: 'password123',
    created_at: '2026-10-01T00:00:00Z'
  };

  const userMaya: User = {
    id: 'usr-maya-03',
    email: 'maya@growth.us',
    full_name: 'Maya Patel (Solo)',
    phone_number: '+91 91234 56789',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    timezone: 'Asia/Kolkata',
    xp_points: 850,
    level: 3,
    is_email_verified: true,
    is_phone_verified: false,
    partner_id: null,
    partnership_id: null,
    share_progress_with_partner: false,
    password: 'password123',
    created_at: '2026-11-01T00:00:00Z'
  };

  const partnership: Partnership = {
    id: 'part-01',
    user_a_id: userAlex.id,
    user_b_id: userSam.id,
    anniversary_date: '2024-06-15',
    shared_streak: 18,
    best_shared_streak: 24,
    status: 'active',
    created_at: '2026-10-01T00:00:00Z'
  };

  const habits: Habit[] = [
    // Alex's habits
    {
      id: 'h-1',
      user_id: userAlex.id,
      name: 'Morning Workout & Stretching',
      category: 'health_fitness',
      description: '30 mins of strength, core, or cardio exercises',
      frequency: 'daily',
      days_of_week: [0, 1, 2, 3, 4, 5, 6],
      daily_target: 1,
      target_unit: 'sessions',
      target_minutes: 30,
      start_date: '2026-11-01',
      is_active: true,
      is_private: false,
      is_shared: true,
      created_at: '2026-11-01T00:00:00Z'
    },
    {
      id: 'h-2',
      user_id: userAlex.id,
      name: 'Drink 3L Hydration Target',
      category: 'health_fitness',
      description: 'Consistent water intake throughout day',
      frequency: 'daily',
      days_of_week: [0, 1, 2, 3, 4, 5, 6],
      daily_target: 3,
      target_unit: 'liters',
      start_date: '2026-11-01',
      is_active: true,
      is_private: false,
      is_shared: true,
      created_at: '2026-11-01T00:00:00Z'
    },
    {
      id: 'h-3',
      user_id: userAlex.id,
      name: 'Solve 2 LeetCode / DSA Problems',
      category: 'technical_development',
      description: 'Focus on graphs, dynamic programming, and trees',
      frequency: 'daily',
      days_of_week: [1, 2, 3, 4, 5, 6],
      daily_target: 2,
      target_unit: 'problems',
      start_date: '2026-11-01',
      is_active: true,
      is_private: false,
      is_shared: true,
      created_at: '2026-11-01T00:00:00Z'
    },
    {
      id: 'h-4',
      user_id: userAlex.id,
      name: 'SkillRack Daily Challenge',
      category: 'technical_development',
      description: 'Maintain high test case accuracy and timing',
      frequency: 'daily',
      days_of_week: [1, 2, 3, 4, 5],
      daily_target: 1,
      target_unit: 'challenge',
      start_date: '2026-11-01',
      is_active: true,
      is_private: false,
      is_shared: false,
      created_at: '2026-11-01T00:00:00Z'
    },

    // Sam's habits
    {
      id: 'h-5',
      user_id: userSam.id,
      name: 'Morning Workout & Stretching',
      category: 'health_fitness',
      description: '30 mins of strength, core, or cardio exercises',
      frequency: 'daily',
      days_of_week: [0, 1, 2, 3, 4, 5, 6],
      daily_target: 1,
      target_unit: 'sessions',
      target_minutes: 30,
      start_date: '2026-11-01',
      is_active: true,
      is_private: false,
      is_shared: true,
      created_at: '2026-11-01T00:00:00Z'
    },
    {
      id: 'h-6',
      user_id: userSam.id,
      name: 'GitHub Green Squares Contribution',
      category: 'technical_development',
      description: 'Push commits to active open-source or platform repo',
      frequency: 'daily',
      days_of_week: [0, 1, 2, 3, 4, 5, 6],
      daily_target: 1,
      target_unit: 'commit',
      start_date: '2026-11-01',
      is_active: true,
      is_private: false,
      is_shared: true,
      created_at: '2026-11-01T00:00:00Z'
    },
    {
      id: 'h-7',
      user_id: userSam.id,
      name: 'Read 20 Pages of Tech / Growth Book',
      category: 'personal_development',
      description: 'Read non-fiction & write nightly gratitude',
      frequency: 'daily',
      days_of_week: [0, 1, 2, 3, 4, 5, 6],
      daily_target: 20,
      target_unit: 'pages',
      start_date: '2026-11-01',
      is_active: true,
      is_private: false,
      is_shared: true,
      created_at: '2026-11-01T00:00:00Z'
    },

    // Maya's habits (Independent solo user)
    {
      id: 'h-8',
      user_id: userMaya.id,
      name: 'Morning 5km Jog',
      category: 'health_fitness',
      description: 'Aerobic fitness and fresh air',
      frequency: 'daily',
      days_of_week: [1, 3, 5, 6],
      daily_target: 5,
      target_unit: 'km',
      start_date: '2026-11-01',
      is_active: true,
      is_private: true,
      is_shared: false,
      created_at: '2026-11-01T00:00:00Z'
    },
    {
      id: 'h-9',
      user_id: userMaya.id,
      name: 'Python Data Science Practice',
      category: 'technical_development',
      description: 'Pandas, NumPy, and machine learning pipelines',
      frequency: 'daily',
      days_of_week: [0, 1, 2, 3, 4, 5, 6],
      daily_target: 1,
      target_unit: 'notebook',
      start_date: '2026-11-01',
      is_active: true,
      is_private: true,
      is_shared: false,
      created_at: '2026-11-01T00:00:00Z'
    }
  ];

  // Active Month Habit Completions (November 1-18, 2026)
  const habitCompletions: HabitCompletion[] = [];
  for (let day = 1; day <= 18; day++) {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `2026-11-${dayStr}`;

    habits.forEach((habit) => {
      const completed = (day % 7 !== 4);
      if (completed) {
        habitCompletions.push({
          id: `comp-${habit.id}-${dateStr}`,
          habit_id: habit.id,
          user_id: habit.user_id,
          completion_date: dateStr,
          value_completed: habit.daily_target,
          is_completed: true,
          created_at: `${dateStr}T10:00:00Z`
        });
      }
    });
  }

  // Active Month Screen Time (November 1-18, 2026)
  const screenTimeEntries: ScreenTimeEntry[] = [];
  for (let day = 1; day <= 18; day++) {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `2026-11-${dayStr}`;

    [userAlex, userSam, userMaya].forEach((user, idx) => {
      screenTimeEntries.push({
        id: `st-${user.id}-${dateStr}`,
        user_id: user.id,
        entry_date: dateStr,
        total_minutes: 260 + idx * 30 + (day % 3) * 15,
        social_media_minutes: 35 + (day % 4) * 5,
        entertainment_minutes: 30 + (day % 2) * 10,
        learning_minutes: 80 + (day % 3) * 10,
        coding_minutes: 115 + (day % 2) * 20,
        gaming_minutes: 0,
        other_minutes: 0,
        notes: 'Focused productive flow',
        created_at: `${dateStr}T21:30:00Z`
      });
    });
  }

  // Permanent Compact Monthly Summaries (October 2026)
  const monthlySummaries: MonthlySummary[] = [
    {
      id: 'summary-alex-2026-10',
      user_id: userAlex.id,
      partnership_id: partnership.id,
      month: 'October',
      year: 2026,
      month_year: '2026-10',
      completion_percentage: 85.0,
      screen_time_avg: 245,
      total_habits_completed: 160,
      partner_completion_percentage: 92.0,
      couple_completion_percentage: 88.5,
      finalized_at: '2026-10-31T23:59:59Z'
    },
    {
      id: 'summary-sam-2026-10',
      user_id: userSam.id,
      partnership_id: partnership.id,
      month: 'October',
      year: 2026,
      month_year: '2026-10',
      completion_percentage: 92.0,
      screen_time_avg: 275,
      total_habits_completed: 152,
      partner_completion_percentage: 85.0,
      couple_completion_percentage: 88.5,
      finalized_at: '2026-10-31T23:59:59Z'
    }
  ];

  const careerActivities: CareerActivity[] = [
    {
      id: 'ca-1',
      user_id: userAlex.id,
      activity_type: 'leetcode',
      title: 'Solved 15 Dynamic Programming Problems',
      platform: 'LeetCode',
      description: 'Mastered Knapsack and DP algorithms.',
      proof_url: 'https://leetcode.com/discuss',
      metrics_value: 15,
      event_date: '2026-11-16',
      created_at: '2026-11-16T18:00:00Z'
    },
    {
      id: 'ca-2',
      user_id: userSam.id,
      activity_type: 'hackathon',
      title: 'Won 2nd Place at Cloud AI Hackathon',
      platform: 'Devpost / Google Cloud',
      description: 'Collaborative data intelligence pipeline using Gemini.',
      proof_url: 'https://devpost.com/software/us-grow',
      metrics_value: 1,
      event_date: '2026-11-12',
      created_at: '2026-11-12T20:00:00Z'
    }
  ];

  const monthlyCycles: MonthlyCycle[] = [
    {
      id: 'cycle-2026-11',
      user_id: userAlex.id,
      month_year: '2026-11',
      title: 'November Mastery & Technical Elevation',
      theme_quote: 'Continuous daily discipline transforms lifetimes.',
      start_date: '2026-11-01',
      end_date: '2026-11-30',
      is_active: true,
      target_score: 88,
      summary_notes: 'Active monthly cycle. Day 18 of 30.',
      created_at: '2026-11-01T00:00:00Z'
    }
  ];

  const monthlyGoals: MonthlyGoal[] = [
    {
      id: 'mg-1',
      cycle_id: 'cycle-2026-11',
      user_id: userAlex.id,
      title: 'Solve 60 LeetCode Medium Problems',
      category: 'technical_development',
      target_value: 60,
      current_value: 48,
      is_completed: false,
      created_at: '2026-11-01T00:00:00Z'
    }
  ];

  const partnerInvitations: PartnerInvitation[] = [
    {
      id: 'inv-maya-sample',
      sender_user_id: userMaya.id,
      sender_name: 'Maya Patel',
      sender_email: 'maya@growth.us',
      receiver_email: 'alex@growth.us',
      invite_code: 'US-MAYA-44',
      status: 'pending',
      created_at: '2026-11-17T14:00:00Z'
    }
  ];

  return {
    allUsers: [userAlex, userSam, userMaya],
    currentUserId: userAlex.id, // Start as Alex
    partnerships: [partnership],
    partnerInvitations,
    habits,
    habitCompletions,
    screenTimeEntries,
    screenTimeGoals: {
      max_social_media_minutes: 60,
      max_entertainment_minutes: 60,
      min_productive_minutes: 180
    },
    careerActivities,
    monthlyCycles,
    monthlyGoals,
    monthlySummaries,
    achievements: INITIAL_ACHIEVEMENTS,
    userAchievements: [
      { id: 'ua-1', user_id: userAlex.id, achievement_id: 'ach-1', unlocked_at: '2026-10-01T12:00:00Z' },
      { id: 'ua-2', user_id: userSam.id, achievement_id: 'ach-1', unlocked_at: '2026-10-01T12:00:00Z' }
    ],
    encouragementMessages: [
      {
        id: 'em-1',
        sender_id: userAlex.id,
        receiver_id: userSam.id,
        message: "So proud of your hackathon win! Let's crush our DSA goals today 💪",
        date_key: TODAY_STR,
        is_read: true,
        created_at: `${TODAY_STR}T08:15:00Z`
      }
    ],
    notifications: [
      {
        id: 'notif-1',
        user_id: userAlex.id,
        title: 'New Partner Invitation Received',
        message: 'Maya Patel (maya@growth.us) invited you to connect.',
        type: 'invitation',
        is_read: false,
        created_at: '2026-11-17T14:00:00Z'
      }
    ],
    selectedMonthYear: '2026-11'
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
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) {
      const initial = getInitialDefaultState();
      saveAppState(initial, false);
      return initial;
    }
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
    return getInitialDefaultState();
  }
}

export function saveAppState(state: AppState, broadcast = true): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
