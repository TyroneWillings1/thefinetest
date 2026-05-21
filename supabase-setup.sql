-- The FINE Test compatibility admin setup.
-- Safe to run more than once.

create table if not exists public.compatibility_questions (
  id uuid primary key default gen_random_uuid(),
  prompt text not null,
  description text default '',
  description_enabled boolean not null default true,
  sort_order integer not null default 1,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.compatibility_questions
add column if not exists description_enabled boolean not null default true;

create table if not exists public.compatibility_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.compatibility_questions(id) on delete cascade,
  label text not null,
  points integer not null default 0,
  sort_order integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.compatibility_submissions (
  id uuid primary key default gen_random_uuid(),
  name text,
  contact text,
  score integer not null default 0,
  max_score integer not null default 0,
  percent integer not null default 0,
  result_tier text not null default '',
  result_message text default '',
  created_at timestamptz not null default now()
);

alter table public.compatibility_submissions
add column if not exists result_message text default '';

alter table public.compatibility_submissions
add column if not exists notification_sent_at timestamptz;

create table if not exists public.compatibility_answers (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.compatibility_submissions(id) on delete cascade,
  question_id uuid references public.compatibility_questions(id) on delete set null,
  option_id uuid references public.compatibility_options(id) on delete set null,
  question_prompt text not null,
  option_label text not null,
  points integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.compatibility_result_bands (
  id uuid primary key default gen_random_uuid(),
  min_percent integer not null default 0,
  max_percent integer not null default 100,
  title text not null default 'Custom Result',
  message text not null default '',
  sort_order integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.compatibility_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.compatibility_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.compatibility_tests (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  public_id text unique not null,
  title text not null default 'Compatibility Test',
  description text default '',
  email_notifications_enabled boolean not null default false,
  short_test_enabled boolean not null default false,
  short_question_count integer not null default 10,
  advanced_results_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.compatibility_questions
add column if not exists test_id uuid references public.compatibility_tests(id) on delete cascade;

alter table public.compatibility_result_bands
add column if not exists test_id uuid references public.compatibility_tests(id) on delete cascade;

alter table public.compatibility_submissions
add column if not exists test_id uuid references public.compatibility_tests(id) on delete cascade;

alter table public.compatibility_tests
add column if not exists email_notifications_enabled boolean not null default false;

do $$
declare
  legacy_owner uuid;
  legacy_test uuid;
  legacy_public_id text;
  legacy_details jsonb;
  legacy_advanced jsonb;
begin
  select id into legacy_owner
  from auth.users
  order by created_at asc
  limit 1;

  select value into legacy_details
  from public.compatibility_settings
  where key = 'quiz_details';

  select value into legacy_advanced
  from public.compatibility_settings
  where key = 'advanced_results';

  if legacy_owner is not null
    and exists (select 1 from public.compatibility_questions where test_id is null)
    and not exists (select 1 from public.compatibility_tests)
  then
    legacy_public_id := substring(replace(gen_random_uuid()::text, '-', '') from 1 for 6);

    insert into public.compatibility_tests (
      owner_id,
      public_id,
      title,
      description,
      short_test_enabled,
      short_question_count,
      advanced_results_enabled
    )
    values (
      legacy_owner,
      legacy_public_id,
      coalesce(nullif(legacy_details->>'title', ''), 'Compatibility Test'),
      coalesce(legacy_details->>'description', ''),
      coalesce((legacy_details->>'short_test_enabled')::boolean, false),
      coalesce((legacy_details->>'short_question_count')::integer, 10),
      coalesce((legacy_advanced->>'enabled')::boolean, false)
    )
    returning id into legacy_test;

    update public.compatibility_questions
    set test_id = legacy_test
    where test_id is null;

    update public.compatibility_result_bands
    set test_id = legacy_test
    where test_id is null;

    update public.compatibility_submissions
    set test_id = legacy_test
    where test_id is null;
  end if;
end $$;

alter table public.compatibility_questions enable row level security;
alter table public.compatibility_options enable row level security;
alter table public.compatibility_submissions enable row level security;
alter table public.compatibility_answers enable row level security;
alter table public.compatibility_result_bands enable row level security;
alter table public.compatibility_settings enable row level security;
alter table public.compatibility_profiles enable row level security;
alter table public.compatibility_tests enable row level security;

drop policy if exists "Public can read active questions" on public.compatibility_questions;
create policy "Public can read active questions"
on public.compatibility_questions
for select
to anon, authenticated
using (
  (active = true and test_id is not null)
  or exists (
    select 1 from public.compatibility_tests t
    where t.id = compatibility_questions.test_id
      and t.owner_id = auth.uid()
  )
);

drop policy if exists "Admins can manage questions" on public.compatibility_questions;
create policy "Admins can manage questions"
on public.compatibility_questions
for all
to authenticated
using (
  exists (
    select 1 from public.compatibility_tests t
    where t.id = compatibility_questions.test_id
      and t.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.compatibility_tests t
    where t.id = compatibility_questions.test_id
      and t.owner_id = auth.uid()
  )
);

drop policy if exists "Public can read active question options" on public.compatibility_options;
create policy "Public can read active question options"
on public.compatibility_options
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.compatibility_questions q
    where q.id = compatibility_options.question_id
      and (q.active = true or auth.role() = 'authenticated')
  )
);

drop policy if exists "Admins can manage options" on public.compatibility_options;
create policy "Admins can manage options"
on public.compatibility_options
for all
to authenticated
using (
  exists (
    select 1
    from public.compatibility_questions q
    join public.compatibility_tests t on t.id = q.test_id
    where q.id = compatibility_options.question_id
      and t.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.compatibility_questions q
    join public.compatibility_tests t on t.id = q.test_id
    where q.id = compatibility_options.question_id
      and t.owner_id = auth.uid()
  )
);

drop policy if exists "Public can submit compatibility results" on public.compatibility_submissions;
create policy "Public can submit compatibility results"
on public.compatibility_submissions
for insert
to anon, authenticated
with check (true);

drop policy if exists "Admins can read compatibility results" on public.compatibility_submissions;
create policy "Admins can read compatibility results"
on public.compatibility_submissions
for select
to authenticated
using (
  exists (
    select 1 from public.compatibility_tests t
    where t.id = compatibility_submissions.test_id
      and t.owner_id = auth.uid()
  )
);

drop policy if exists "Admins can delete compatibility results" on public.compatibility_submissions;
create policy "Admins can delete compatibility results"
on public.compatibility_submissions
for delete
to authenticated
using (
  exists (
    select 1 from public.compatibility_tests t
    where t.id = compatibility_submissions.test_id
      and t.owner_id = auth.uid()
  )
);

drop policy if exists "Public can submit compatibility answers" on public.compatibility_answers;
create policy "Public can submit compatibility answers"
on public.compatibility_answers
for insert
to anon, authenticated
with check (true);

drop policy if exists "Admins can read compatibility answers" on public.compatibility_answers;
create policy "Admins can read compatibility answers"
on public.compatibility_answers
for select
to authenticated
using (
  exists (
    select 1
    from public.compatibility_submissions s
    join public.compatibility_tests t on t.id = s.test_id
    where s.id = compatibility_answers.submission_id
      and t.owner_id = auth.uid()
  )
);

drop policy if exists "Public can read result bands" on public.compatibility_result_bands;
create policy "Public can read result bands"
on public.compatibility_result_bands
for select
to anon, authenticated
using (
  test_id is not null
  or exists (
    select 1 from public.compatibility_tests t
    where t.id = compatibility_result_bands.test_id
      and t.owner_id = auth.uid()
  )
);

drop policy if exists "Admins can manage result bands" on public.compatibility_result_bands;
create policy "Admins can manage result bands"
on public.compatibility_result_bands
for all
to authenticated
using (
  exists (
    select 1 from public.compatibility_tests t
    where t.id = compatibility_result_bands.test_id
      and t.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.compatibility_tests t
    where t.id = compatibility_result_bands.test_id
      and t.owner_id = auth.uid()
  )
);

drop policy if exists "Public can read compatibility settings" on public.compatibility_settings;
create policy "Public can read compatibility settings"
on public.compatibility_settings
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage compatibility settings" on public.compatibility_settings;
create policy "Admins can manage compatibility settings"
on public.compatibility_settings
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read compatibility profiles" on public.compatibility_profiles;
create policy "Public can read compatibility profiles"
on public.compatibility_profiles
for select
to anon, authenticated
using (true);

drop policy if exists "Users can create their own compatibility profile" on public.compatibility_profiles;
create policy "Users can create their own compatibility profile"
on public.compatibility_profiles
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own compatibility profile" on public.compatibility_profiles;
create policy "Users can update their own compatibility profile"
on public.compatibility_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Public can read compatibility tests" on public.compatibility_tests;
create policy "Public can read compatibility tests"
on public.compatibility_tests
for select
to anon, authenticated
using (true);

drop policy if exists "Users can create their own compatibility tests" on public.compatibility_tests;
create policy "Users can create their own compatibility tests"
on public.compatibility_tests
for insert
to authenticated
with check (auth.uid() = owner_id);

drop policy if exists "Users can update their own compatibility tests" on public.compatibility_tests;
create policy "Users can update their own compatibility tests"
on public.compatibility_tests
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "Users can delete their own compatibility tests" on public.compatibility_tests;
create policy "Users can delete their own compatibility tests"
on public.compatibility_tests
for delete
to authenticated
using (auth.uid() = owner_id);

create or replace function public.delete_current_user()
returns void
language plpgsql
security definer
set search_path = auth, public
as $$
begin
  delete from auth.users
  where id = auth.uid();
end;
$$;

revoke all on function public.delete_current_user() from public;
grant execute on function public.delete_current_user() to authenticated;

insert into public.compatibility_result_bands (min_percent, max_percent, title, message, sort_order)
select *
from (
  values
    (0, 39, 'Not My Type', 'The compatibility is low, but thanks for taking the test.', 1),
    (40, 59, 'Mixed Signal', 'There are some overlaps, but some important gaps too.', 2),
    (60, 79, 'Promising', 'This has enough alignment to be interesting.', 3),
    (80, 100, 'Strong Match', 'This looks like a strong compatibility match.', 4)
) as band(min_percent, max_percent, title, message, sort_order)
where not exists (select 1 from public.compatibility_result_bands);

insert into public.compatibility_settings (key, value)
values ('advanced_results', '{"enabled": false}'::jsonb)
on conflict (key) do nothing;

insert into public.compatibility_settings (key, value)
values ('quiz_details', '{"title": "Compatibility Test", "description": "", "public_id": "", "short_test_enabled": false, "short_question_count": 10}'::jsonb)
on conflict (key) do nothing;

-- Random question templates now live in the app and are only added when you click random-question controls.
