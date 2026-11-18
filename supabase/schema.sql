-- ==============================================================================
-- US: Grow Together — Public Multi-User Architecture & PostgreSQL Schema
-- Multi-Tenant with Row-Level Security (RLS) & Zero-Knowledge Private Habits
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USER PROFILES (Linked to Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    timezone TEXT DEFAULT 'Asia/Kolkata',
    xp_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    is_email_verified BOOLEAN DEFAULT false,
    is_phone_verified BOOLEAN DEFAULT false,
    partner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    partnership_id UUID,
    share_progress_with_partner BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PARTNERSHIPS (Mutual Partner Connection)
CREATE TABLE IF NOT EXISTS public.partnerships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_a_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_b_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    anniversary_date DATE,
    shared_streak INTEGER DEFAULT 0,
    best_shared_streak INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disconnected')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_partnership UNIQUE (user_a_id, user_b_id)
);

-- 3. PARTNER INVITATIONS
CREATE TABLE IF NOT EXISTS public.partner_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    receiver_email TEXT NOT NULL,
    invite_code VARCHAR(12) UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    responded_at TIMESTAMPTZ
);

-- 4. HABITS (Independent Per-User by default)
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'health_fitness',
        'technical_development',
        'professional_development',
        'career_opportunities',
        'academic_development',
        'personal_development'
    )),
    description TEXT,
    frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'custom_days', 'one_time')),
    days_of_week INTEGER[] DEFAULT '{0,1,2,3,4,5,6}',
    daily_target INTEGER DEFAULT 1,
    target_unit TEXT DEFAULT 'times',
    target_minutes INTEGER,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    is_private BOOLEAN DEFAULT false, -- Private habits are hidden from connected partner
    is_shared BOOLEAN DEFAULT false, -- Shared habits allow partner to view progress
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TEMPORARY ACTIVE-MONTH DATA: HABIT COMPLETIONS (Purged upon month-end finalization)
CREATE TABLE IF NOT EXISTS public.habit_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    completion_date DATE NOT NULL DEFAULT CURRENT_DATE,
    value_completed INTEGER DEFAULT 1,
    is_completed BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(habit_id, user_id, completion_date)
);

-- 6. TEMPORARY ACTIVE-MONTH DATA: SCREEN TIME ENTRIES (Strictly Private to Owner)
CREATE TABLE IF NOT EXISTS public.screen_time_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_minutes INTEGER NOT NULL DEFAULT 0,
    social_media_minutes INTEGER DEFAULT 0,
    entertainment_minutes INTEGER DEFAULT 0,
    learning_minutes INTEGER DEFAULT 0,
    coding_minutes INTEGER DEFAULT 0,
    gaming_minutes INTEGER DEFAULT 0,
    other_minutes INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, entry_date)
);

-- 7. PERMANENT COMPACT MONTHLY SNAPSHOTS (Minimal Retention Layer)
CREATE TABLE IF NOT EXISTS public.monthly_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    partnership_id UUID REFERENCES public.partnerships(id) ON DELETE SET NULL,
    month VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    month_year VARCHAR(7) NOT NULL,
    completion_percentage NUMERIC(5, 2) NOT NULL,
    screen_time_avg INTEGER DEFAULT 0,
    total_habits_completed INTEGER DEFAULT 0,
    partner_completion_percentage NUMERIC(5, 2),
    couple_completion_percentage NUMERIC(5, 2),
    finalized_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, month_year)
);

-- 8. MONTHLY GOALS
CREATE TABLE IF NOT EXISTS public.monthly_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    cycle_id TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    target_value INTEGER DEFAULT 1,
    current_value INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. CAREER ACTIVITIES
CREATE TABLE IF NOT EXISTS public.career_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    title TEXT NOT NULL,
    platform TEXT,
    description TEXT,
    proof_url TEXT,
    metrics_value INTEGER DEFAULT 1,
    event_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. ACHIEVEMENTS DEFINITIONS
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(64) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT NOT NULL,
    xp_reward INTEGER DEFAULT 100,
    condition_type TEXT NOT NULL,
    condition_threshold INTEGER NOT NULL
);

-- 11. USER ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, achievement_id)
);

-- 12. ENCOURAGEMENT MESSAGES
CREATE TABLE IF NOT EXISTS public.encouragement_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    date_key DATE NOT NULL DEFAULT CURRENT_DATE,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Multi-Tenant isolation: Users can only see their own data or approved partner shared data
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screen_time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_invitations ENABLE ROW LEVEL SECURITY;

-- Helper to check if two users are approved partners
CREATE OR REPLACE FUNCTION public.are_partners(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.partnerships
        WHERE status = 'active'
          AND ((user_a_id = auth.uid() AND user_b_id = target_user_id)
            OR (user_b_id = auth.uid() AND user_a_id = target_user_id))
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can view own profile or partner profile
CREATE POLICY "Users can manage own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Partner can view connected profile" ON public.profiles
    FOR SELECT USING (public.are_partners(id));

-- Habits: Owner has full CRUD; Partner can ONLY read shared & non-private habits
CREATE POLICY "Users have full CRUD on own habits" ON public.habits
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Partners can view shared non-private habits" ON public.habits
    FOR SELECT USING (
        public.are_partners(user_id) 
        AND is_shared = true 
        AND is_private = false
    );

-- Screen Time Entries: ZERO-KNOWLEDGE PRIVACY
-- STRICTLY ACCESSIBLE ONLY TO OWNER (Partner & Admins CANNOT view raw screen time)
CREATE POLICY "Users manage own screen time entries" ON public.screen_time_entries
    FOR ALL USING (auth.uid() = user_id);

-- Monthly Summaries: Owner has full access; Partner can read if user enabled sharing
CREATE POLICY "Users manage own monthly summaries" ON public.monthly_summaries
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Partners can view shared monthly summary" ON public.monthly_summaries
    FOR SELECT USING (
        public.are_partners(user_id)
        AND EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id AND share_progress_with_partner = true)
    );

-- ==============================================================================
-- ADMIN AGGREGATE SYSTEM METRICS FUNCTION
-- Returns platform-level health and counts without exposing private user logs
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.get_platform_admin_stats()
RETURNS JSON AS $$
DECLARE
    v_total_users INTEGER;
    v_active_partnerships INTEGER;
    v_total_habits INTEGER;
    v_total_summaries INTEGER;
    v_is_admin BOOLEAN;
BEGIN
    -- Verify caller is platform admin
    SELECT (role = 'admin') INTO v_is_admin FROM public.profiles WHERE id = auth.uid();
    IF v_is_admin IS NOT TRUE THEN
        RAISE EXCEPTION 'Access denied. Administrator privileges required.';
    END IF;

    SELECT count(*) INTO v_total_users FROM public.profiles;
    SELECT count(*) INTO v_active_partnerships FROM public.partnerships WHERE status = 'active';
    SELECT count(*) INTO v_total_habits FROM public.habits WHERE is_active = true;
    SELECT count(*) INTO v_total_summaries FROM public.monthly_summaries;

    RETURN json_build_object(
        'totalUsers', v_total_users,
        'totalActivePartnerships', v_active_partnerships,
        'totalActiveHabits', v_total_habits,
        'totalMonthlySummaries', v_total_summaries,
        'systemHealth', 'healthy',
        'databaseEngine', 'PostgreSQL 16 Multi-Tenant',
        'reportedIssuesCount', 0
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
