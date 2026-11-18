export type UserRole = 'user' | 'admin';

export type HabitCategory =
  | 'health_fitness'
  | 'technical_development'
  | 'professional_development'
  | 'career_opportunities'
  | 'academic_development'
  | 'personal_development';

export type HabitFrequency = 'daily' | 'weekly' | 'custom_days' | 'one_time';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  avatar_url?: string;
  role: UserRole;
  timezone: string;
  xp_points: number;
  level: number;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  partner_id?: string | null; // ID of approved partner if connected
  partnership_id?: string | null;
  share_progress_with_partner?: boolean;
  password?: string; // Stored securely/simulated in local engine
  invite_code?: string; // Permanent 6-character partner invite code e.g. 'NX-83F19A'
  created_at: string;
}

export interface Partnership {
  id: string;
  user_a_id: string;
  user_b_id: string;
  anniversary_date?: string;
  shared_streak: number;
  best_shared_streak: number;
  status: 'active' | 'disconnected';
  created_at: string;
}

export interface PartnerInvitation {
  id: string;
  sender_user_id: string;
  sender_name: string;
  sender_email: string;
  receiver_email: string;
  invite_code: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  created_at: string;
  responded_at?: string;
}

export interface Habit {
  id: string;
  user_id: string; // Owner of the habit (Multi-tenant)
  name: string;
  category: HabitCategory;
  description: string;
  frequency: HabitFrequency;
  days_of_week: number[]; // 0=Sunday, 6=Saturday
  daily_target: number;
  target_unit: string;
  target_minutes?: number;
  start_date: string;
  is_active: boolean;
  is_private: boolean; // Private habits are strictly hidden from partner
  is_shared: boolean; // True if shared with partner
  reminder_time?: string;
  created_at: string;
}

// Temporary Active-Month Detailed Table (Purged upon month finalization)
export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string; // Associated with authenticated user
  completion_date: string; // YYYY-MM-DD (active month only)
  value_completed: number;
  is_completed: boolean;
  notes?: string;
  created_at: string;
}

// Temporary Active-Month Detailed Table (Purged upon month finalization)
export interface ScreenTimeEntry {
  id: string;
  user_id: string; // Associated with authenticated user
  entry_date: string; // YYYY-MM-DD (active month only)
  total_minutes: number;
  social_media_minutes: number;
  entertainment_minutes: number;
  learning_minutes: number;
  coding_minutes: number;
  gaming_minutes: number;
  other_minutes: number;
  notes?: string;
  created_at: string;
}

export interface ScreenTimeGoals {
  max_social_media_minutes: number;
  max_entertainment_minutes: number;
  min_productive_minutes: number;
}

export type CareerActivityType =
  | 'leetcode'
  | 'skillrack'
  | 'github'
  | 'linkedin'
  | 'certification'
  | 'hackathon'
  | 'workshop'
  | 'project'
  | 'internship'
  | 'skill';

export interface CareerActivity {
  id: string;
  user_id: string;
  activity_type: CareerActivityType;
  title: string;
  platform?: string;
  description?: string;
  proof_url?: string;
  metrics_value: number;
  event_date: string;
  created_at: string;
}

export interface MonthlyCycle {
  id: string;
  user_id: string; // Associated with user workspace
  month_year: string; // "2026-11"
  title: string;
  theme_quote: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  target_score: number;
  summary_notes?: string;
  created_at: string;
}

// PERMANENT COMPACT MONTHLY SNAPSHOT (Minimal Data Retention Layer)
export interface MonthlySummary {
  id: string;
  user_id: string;
  partnership_id?: string | null;
  month: string; // e.g. "November"
  year: number; // e.g. 2026
  month_year: string; // e.g. "2026-11"
  completion_percentage: number; // User's final percentage
  screen_time_avg: number; // daily average in minutes
  total_habits_completed: number;
  partner_completion_percentage?: number | null; // Optional partner number if shared
  couple_completion_percentage?: number | null; // Optional combined couple average
  finalized_at: string;
}

export interface MonthlyGoal {
  id: string;
  cycle_id: string;
  user_id: string;
  title: string;
  category: string;
  target_value: number;
  current_value: number;
  is_completed: boolean;
  created_at: string;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  category: 'couple' | 'habits' | 'career' | 'fitness' | 'discipline';
  icon: string;
  xp_reward: number;
  condition_type: string;
  condition_threshold: number;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

export interface EncouragementMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  date_key: string;
  is_read: boolean;
  created_at: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'achievement' | 'invitation';
  is_read: boolean;
  created_at: string;
}

export interface AdminSystemStats {
  totalUsers: number;
  verifiedEmailUsers: number;
  verifiedPhoneUsers: number;
  totalActivePartnerships: number;
  totalActiveHabits: number;
  totalMonthlySummaries: number;
  systemHealth: 'healthy' | 'degraded';
  databaseEngine: string;
  reportedIssuesCount: number;
}
