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

with seed_questions(prompt, description, sort_order) as (
  values
    ('What kind of weekend sounds best?', 'Pick the answer that feels most natural to you.', 1),
    ('How do you handle conflict?', 'Be honest. This one matters.', 2),
    ('What is your texting style?', 'No judgment. Mostly.', 3),
    ('How important is ambition to you?', 'This is about direction, not job title.', 4),
    ('What kind of humor do you like most?', 'Pick the one you naturally gravitate toward.', 5),
    ('How do you feel about personal space?', 'Everybody has a different setting here.', 6),
    ('How do you prefer to make plans?', 'Planning style says a lot.', 7),
    ('What is your money style?', 'Not about wealth. About habits.', 8),
    ('What is your ideal first date vibe?', 'The energy matters.', 9),
    ('How do you recharge?', 'Social battery check.', 10),
    ('How direct are you?', 'Can you say the thing?', 11),
    ('How do you feel about fitness or health?', 'General lifestyle alignment.', 12),
    ('How affectionate are you?', 'Public and private affection count.', 13),
    ('How do you handle jealousy?', 'Green flag or problem area.', 14),
    ('What pace feels right in dating?', 'How fast should things move?', 15),
    ('What is your relationship goal?', 'This one should be obvious, but here we are.', 16),
    ('How do you treat routines?', 'Structure or chaos?', 17),
    ('How do you act around friends?', 'Social character check.', 18),
    ('How do you feel about sarcasm?', 'Important for survival.', 19),
    ('What kind of communication feels best?', 'The default channel.', 20),
    ('How do you respond to stress?', 'Pressure reveals a lot.', 21),
    ('How clean are you?', 'Simple but important.', 22),
    ('How do you feel about learning new things?', 'Curiosity check.', 23),
    ('What kind of loyalty matters most?', 'Pick the one that sounds like you.', 24),
    ('What makes someone attractive long-term?', 'Past the first impression.', 25)
)
insert into public.compatibility_questions (prompt, description, description_enabled, sort_order, active)
select prompt, description, true, sort_order, true
from seed_questions sq
where not exists (
  select 1 from public.compatibility_questions existing where existing.prompt = sq.prompt
);

with seed_answers(prompt, label, points, sort_order) as (
  values
    ('What kind of weekend sounds best?', 'Quiet night in', 10, 1),
    ('What kind of weekend sounds best?', 'Dinner and drinks', 8, 2),
    ('What kind of weekend sounds best?', 'A full party weekend', 4, 3),
    ('What kind of weekend sounds best?', 'Whatever everyone else wants', 2, 4),
    ('How do you handle conflict?', 'Talk it out directly', 10, 1),
    ('How do you handle conflict?', 'Cool off, then talk', 8, 2),
    ('How do you handle conflict?', 'Make jokes until it passes', 4, 3),
    ('How do you handle conflict?', 'Avoid it completely', 1, 4),
    ('What is your texting style?', 'Normal human pace', 10, 1),
    ('What is your texting style?', 'Fast replies', 8, 2),
    ('What is your texting style?', 'Depends on the day', 6, 3),
    ('What is your texting style?', 'I vanish randomly', 2, 4),
    ('How important is ambition to you?', 'Very important', 10, 1),
    ('How important is ambition to you?', 'Important, but balanced', 9, 2),
    ('How important is ambition to you?', 'Somewhat important', 6, 3),
    ('How important is ambition to you?', 'Not really important', 2, 4),
    ('What kind of humor do you like most?', 'Dry and clever', 10, 1),
    ('What kind of humor do you like most?', 'Playful teasing', 9, 2),
    ('What kind of humor do you like most?', 'Silly and chaotic', 7, 3),
    ('What kind of humor do you like most?', 'I barely joke around', 2, 4),
    ('How do you feel about personal space?', 'I need a healthy amount', 10, 1),
    ('How do you feel about personal space?', 'I like closeness, with balance', 9, 2),
    ('How do you feel about personal space?', 'I want constant attention', 4, 3),
    ('How do you feel about personal space?', 'I disappear when overwhelmed', 3, 4),
    ('How do you prefer to make plans?', 'Plan ahead', 10, 1),
    ('How do you prefer to make plans?', 'Loose plan, flexible details', 9, 2),
    ('How do you prefer to make plans?', 'Spontaneous is better', 6, 3),
    ('How do you prefer to make plans?', 'I avoid planning', 2, 4),
    ('What is your money style?', 'Save first, enjoy second', 10, 1),
    ('What is your money style?', 'Balanced', 9, 2),
    ('What is your money style?', 'Spend on experiences', 7, 3),
    ('What is your money style?', 'I wing it financially', 2, 4),
    ('What is your ideal first date vibe?', 'Low-pressure and conversational', 10, 1),
    ('What is your ideal first date vibe?', 'Dinner with effort', 9, 2),
    ('What is your ideal first date vibe?', 'Something adventurous', 7, 3),
    ('What is your ideal first date vibe?', 'Club or party', 3, 4),
    ('How do you recharge?', 'Alone time', 10, 1),
    ('How do you recharge?', 'One-on-one time', 9, 2),
    ('How do you recharge?', 'Small group hangout', 7, 3),
    ('How do you recharge?', 'Big social scene', 4, 4),
    ('How direct are you?', 'Very direct', 10, 1),
    ('How direct are you?', 'Direct but gentle', 10, 2),
    ('How direct are you?', 'Depends on the situation', 6, 3),
    ('How direct are you?', 'I bottle things up', 2, 4),
    ('How do you feel about fitness or health?', 'It is part of my life', 10, 1),
    ('How do you feel about fitness or health?', 'I try to stay balanced', 8, 2),
    ('How do you feel about fitness or health?', 'I am inconsistent', 5, 3),
    ('How do you feel about fitness or health?', 'I do not care much', 2, 4),
    ('How affectionate are you?', 'Very affectionate', 10, 1),
    ('How affectionate are you?', 'Warm but not clingy', 10, 2),
    ('How affectionate are you?', 'A little reserved', 6, 3),
    ('How affectionate are you?', 'Not affectionate', 2, 4),
    ('How do you handle jealousy?', 'I communicate calmly', 10, 1),
    ('How do you handle jealousy?', 'I need reassurance sometimes', 7, 2),
    ('How do you handle jealousy?', 'I get suspicious easily', 3, 3),
    ('How do you handle jealousy?', 'I test people', 0, 4),
    ('What pace feels right in dating?', 'Intentional but not rushed', 10, 1),
    ('What pace feels right in dating?', 'Slow and steady', 8, 2),
    ('What pace feels right in dating?', 'Fast if it feels right', 7, 3),
    ('What pace feels right in dating?', 'No direction, just vibes', 3, 4),
    ('What is your relationship goal?', 'Something serious', 10, 1),
    ('What is your relationship goal?', 'Open to serious with the right person', 9, 2),
    ('What is your relationship goal?', 'Keeping it casual', 4, 3),
    ('What is your relationship goal?', 'I do not know', 3, 4),
    ('How do you treat routines?', 'I like routine', 10, 1),
    ('How do you treat routines?', 'Some routine, some flexibility', 9, 2),
    ('How do you treat routines?', 'I prefer spontaneity', 6, 3),
    ('How do you treat routines?', 'My life is chaos', 2, 4),
    ('How do you act around friends?', 'Loyal and present', 10, 1),
    ('How do you act around friends?', 'Fun but grounded', 9, 2),
    ('How do you act around friends?', 'I am the wildcard', 5, 3),
    ('How do you act around friends?', 'I bring drama', 0, 4),
    ('How do you feel about sarcasm?', 'Love it when it is clever', 10, 1),
    ('How do you feel about sarcasm?', 'Fine in moderation', 8, 2),
    ('How do you feel about sarcasm?', 'Not really my thing', 5, 3),
    ('How do you feel about sarcasm?', 'I take everything personally', 2, 4),
    ('What kind of communication feels best?', 'Clear and consistent', 10, 1),
    ('What kind of communication feels best?', 'Warm and expressive', 9, 2),
    ('What kind of communication feels best?', 'Short and practical', 6, 3),
    ('What kind of communication feels best?', 'Hard to reach', 2, 4),
    ('How do you respond to stress?', 'I get quiet and solve it', 10, 1),
    ('How do you respond to stress?', 'I talk it through', 9, 2),
    ('How do you respond to stress?', 'I need support', 7, 3),
    ('How do you respond to stress?', 'I spiral outward', 2, 4),
    ('How clean are you?', 'Very clean', 10, 1),
    ('How clean are you?', 'Reasonably clean', 8, 2),
    ('How clean are you?', 'Messy but functional', 4, 3),
    ('How clean are you?', 'Disaster zone', 1, 4),
    ('How do you feel about learning new things?', 'I love learning', 10, 1),
    ('How do you feel about learning new things?', 'I am curious about some things', 8, 2),
    ('How do you feel about learning new things?', 'Only when necessary', 4, 3),
    ('How do you feel about learning new things?', 'Not interested', 1, 4),
    ('What kind of loyalty matters most?', 'Private consistency', 10, 1),
    ('What kind of loyalty matters most?', 'Public support', 8, 2),
    ('What kind of loyalty matters most?', 'Emotional reassurance', 7, 3),
    ('What kind of loyalty matters most?', 'I keep my options open', 1, 4),
    ('What makes someone attractive long-term?', 'Character and consistency', 10, 1),
    ('What makes someone attractive long-term?', 'Humor and chemistry', 9, 2),
    ('What makes someone attractive long-term?', 'Ambition and lifestyle', 8, 3),
    ('What makes someone attractive long-term?', 'Looks mostly', 4, 4)
)
insert into public.compatibility_options (question_id, label, points, sort_order)
select q.id, sa.label, sa.points, sa.sort_order
from seed_answers sa
join public.compatibility_questions q on q.prompt = sa.prompt
where not exists (
  select 1
  from public.compatibility_options existing
  where existing.question_id = q.id
    and existing.label = sa.label
);
