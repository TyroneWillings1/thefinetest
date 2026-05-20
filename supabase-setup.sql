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

alter table public.compatibility_questions enable row level security;
alter table public.compatibility_options enable row level security;
alter table public.compatibility_submissions enable row level security;
alter table public.compatibility_answers enable row level security;
alter table public.compatibility_result_bands enable row level security;

drop policy if exists "Public can read active questions" on public.compatibility_questions;
create policy "Public can read active questions"
on public.compatibility_questions
for select
to anon, authenticated
using (active = true or auth.role() = 'authenticated');

drop policy if exists "Admins can manage questions" on public.compatibility_questions;
create policy "Admins can manage questions"
on public.compatibility_questions
for all
to authenticated
using (true)
with check (true);

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
using (true)
with check (true);

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
using (true);

drop policy if exists "Admins can delete compatibility results" on public.compatibility_submissions;
create policy "Admins can delete compatibility results"
on public.compatibility_submissions
for delete
to authenticated
using (true);

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
using (true);

drop policy if exists "Public can read result bands" on public.compatibility_result_bands;
create policy "Public can read result bands"
on public.compatibility_result_bands
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage result bands" on public.compatibility_result_bands;
create policy "Admins can manage result bands"
on public.compatibility_result_bands
for all
to authenticated
using (true)
with check (true);

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

-- Random question templates now live in the app and are only added when you click random-question controls.

