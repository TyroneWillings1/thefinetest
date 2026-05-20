-- PAUSE BEFORE RUNNING THIS FILE.
-- The compatibility test is being revised to support account-owned tests and
-- owner-specific results. If you have not run this SQL yet, wait for the next
-- version so we do not create the older global-table setup first.

create table if not exists public.compatibility_questions (
  id uuid primary key default gen_random_uuid(),
  prompt text not null,
  description text default '',
  sort_order integer not null default 1,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

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
  created_at timestamptz not null default now()
);

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

alter table public.compatibility_questions enable row level security;
alter table public.compatibility_options enable row level security;
alter table public.compatibility_submissions enable row level security;
alter table public.compatibility_answers enable row level security;

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

insert into public.compatibility_questions (prompt, description, sort_order, active)
values
  ('What kind of weekend sounds best?', 'Pick the answer that feels most natural to you.', 1, true),
  ('How do you usually handle conflict?', 'Be honest. This one matters.', 2, true),
  ('What is your texting style?', 'No judgment. Mostly.', 3, true)
on conflict do nothing;

insert into public.compatibility_options (question_id, label, points, sort_order)
select q.id, option_data.label, option_data.points, option_data.sort_order
from public.compatibility_questions q
cross join (
  values
    ('Quiet night in', 10, 1),
    ('Dinner and drinks', 7, 2),
    ('Full party mode', 3, 3)
) as option_data(label, points, sort_order)
where q.prompt = 'What kind of weekend sounds best?'
  and not exists (
    select 1 from public.compatibility_options existing where existing.question_id = q.id
  );

insert into public.compatibility_options (question_id, label, points, sort_order)
select q.id, option_data.label, option_data.points, option_data.sort_order
from public.compatibility_questions q
cross join (
  values
    ('Talk it out directly', 10, 1),
    ('Cool off, then talk', 8, 2),
    ('Avoid it and hope it fades', 1, 3)
) as option_data(label, points, sort_order)
where q.prompt = 'How do you usually handle conflict?'
  and not exists (
    select 1 from public.compatibility_options existing where existing.question_id = q.id
  );

insert into public.compatibility_options (question_id, label, points, sort_order)
select q.id, option_data.label, option_data.points, option_data.sort_order
from public.compatibility_questions q
cross join (
  values
    ('Fast replies', 8, 1),
    ('Normal human pace', 10, 2),
    ('I vanish randomly', 2, 3)
) as option_data(label, points, sort_order)
where q.prompt = 'What is your texting style?'
  and not exists (
    select 1 from public.compatibility_options existing where existing.question_id = q.id
  );
