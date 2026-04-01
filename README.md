# Running Club (Next.js + Supabase)

This project includes:
- Email login with Supabase Auth
- Insert running records
- Read running records from Supabase

## 1. Environment Variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find both values in Supabase Dashboard:
- Project Settings -> Data API

## 2. Database Table + RLS

Run this SQL in Supabase SQL Editor:

```sql
create table if not exists public.running_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  distance_km numeric(6,2) not null check (distance_km > 0),
  duration_min integer not null check (duration_min > 0),
  created_at timestamptz not null default now()
);

alter table public.running_records enable row level security;

create policy "users_can_select_own_records"
on public.running_records
for select
using (auth.uid() = user_id);

create policy "users_can_insert_own_records"
on public.running_records
for insert
with check (auth.uid() = user_id);
```

## 3. Enable Email Login

In Supabase Dashboard:
- Authentication -> Providers -> Email -> Enable
- Create a user in Authentication -> Users (or sign up via your own flow)

## 4. Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.
