-- AI Adoption Index & Strategic Roadmap Platform for SMBs
-- Supabase Schema Definition

-- Profiles table: stores user info and business type
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  business_name text,
  business_type text,
  industry text,
  contact_email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;
create policy "Users can view own profile." on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile." on public.profiles for insert with check (auth.uid() = id);

-- Assessments table: stores raw answers and the final calculated score
create table public.assessments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Pillar 1: Strategy & Finance
  ai_intensity text,
  budget_type text,
  
  -- Pillar 2: Data & Tech
  data_strategy_status text,
  
  -- Pillar 3: People & Ops
  talent_count text,

  -- Pillar 4: Risk & Governance
  governance_status text,
  
  -- Results
  total_score int,
  category text, -- Initial/Ad-hoc, Mature, AI-First
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for assessments
alter table public.assessments enable row level security;
create policy "Users can view own assessments." on public.assessments for select using (auth.uid() = user_id);
create policy "Users can insert own assessments." on public.assessments for insert with check (auth.uid() = user_id);

-- Roadmaps table: stores generated recommendations linked to the assessment
create table public.roadmaps (
  id uuid default gen_random_uuid() primary key,
  assessment_id uuid references public.assessments(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  recommendations jsonb, -- Array of recommended steps or links
  eligibility_status text, -- e.g., "Eligible for IndiaAI Compute"
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for roadmaps
alter table public.roadmaps enable row level security;
create policy "Users can view own roadmaps." on public.roadmaps for select using (auth.uid() = user_id);
create policy "Users can insert own roadmaps." on public.roadmaps for insert with check (auth.uid() = user_id);

-- Create functions to automatically create profile on sign up if needed (optional)
-- -> This is omitted for brevity, but you can set up an auth trigger if using Supabase Auth.
