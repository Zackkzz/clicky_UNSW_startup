-- Initial public schema for Clicky / ARC MVP
-- Maps Excel sheets:
--   "Club Details"  -> public.societies
--   "Event Details" -> public.activities (events)
-- Plus forum + onboarding interests + profiles (Supabase Auth extension)

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'App user profile; row created when auth user signs up.';

-- ---------------------------------------------------------------------------
-- Onboarding / personalisation (interest tags chosen by the student)
-- ---------------------------------------------------------------------------
create table public.profile_interests (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  tag text not null,
  created_at timestamptz not null default now(),
  primary key (profile_id, tag)
);

create index profile_interests_tag_idx on public.profile_interests (tag);

comment on table public.profile_interests is 'Tags from onboarding; used to rank societies/events (v1 rules engine).';

-- ---------------------------------------------------------------------------
-- Societies / clubs (Rubric society id as stable external key)
-- ---------------------------------------------------------------------------
create table public.societies (
  id bigint primary key,
  name text not null,
  description text,
  category text,
  contact_email text,
  rubric_admin_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index societies_category_idx on public.societies (category);
create index societies_name_idx on public.societies using gin (to_tsvector('simple', name));

comment on table public.societies is 'ARC / Rubric societies; id = societyid from admin.hellorubric.com URLs.';
comment on column public.societies.rubric_admin_url is 'Optional deep link back to Rubric admin for that society.';

-- ---------------------------------------------------------------------------
-- Activities / events (rows from "Event Details")
-- ---------------------------------------------------------------------------
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  society_id bigint not null references public.societies (id) on delete restrict,
  title text not null,
  event_type text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  location text,
  registration_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint activities_time_range check (ends_at >= starts_at)
);

create index activities_society_id_idx on public.activities (society_id);
create index activities_starts_at_idx on public.activities (starts_at);
create index activities_event_type_idx on public.activities (event_type);

comment on table public.activities is 'Events from ARC/Rubric exports; ticketing is usually an external URL.';
comment on column public.activities.event_type is 'Maps Excel "Event Type / Tag (if available)".';

-- ---------------------------------------------------------------------------
-- Forum (peer Q&A)
-- ---------------------------------------------------------------------------
create type public.forum_post_status as enum ('published', 'hidden', 'deleted');

create table public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text not null,
  tags text[] not null default '{}',
  status public.forum_post_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index forum_posts_author_idx on public.forum_posts (author_id);
create index forum_posts_created_idx on public.forum_posts (created_at desc);
create index forum_posts_tags_idx on public.forum_posts using gin (tags);

create table public.forum_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.forum_posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index forum_replies_post_id_idx on public.forum_replies (post_id);

create table public.content_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  target_type text not null,
  target_id uuid not null,
  reason text,
  created_at timestamptz not null default now(),
  constraint content_reports_target_type_check check (
    target_type in ('forum_post', 'forum_reply')
  )
);

create index content_reports_target_idx on public.content_reports (target_type, target_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger (reuse one function)
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

create trigger societies_set_updated_at
before update on public.societies
for each row execute procedure public.set_updated_at();

create trigger activities_set_updated_at
before update on public.activities
for each row execute procedure public.set_updated_at();

create trigger forum_posts_set_updated_at
before update on public.forum_posts
for each row execute procedure public.set_updated_at();

create trigger forum_replies_set_updated_at
before update on public.forum_replies
for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auth: auto-create profile on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.profile_interests enable row level security;
alter table public.societies enable row level security;
alter table public.activities enable row level security;
alter table public.forum_posts enable row level security;
alter table public.forum_replies enable row level security;
alter table public.content_reports enable row level security;

-- Profiles: everyone signed in can read display names for forum UI; users edit only themselves
create policy "Profiles are selectable by authenticated users"
on public.profiles for select
to authenticated
using (true);

create policy "Users can update own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Interests: own rows only
create policy "Interests selectable for own profile"
on public.profile_interests for select
to authenticated
using (auth.uid() = profile_id);

create policy "Interests insert for own profile"
on public.profile_interests for insert
to authenticated
with check (auth.uid() = profile_id);

create policy "Interests delete for own profile"
on public.profile_interests for delete
to authenticated
using (auth.uid() = profile_id);

-- Discovery tables: public read (anon + authenticated), no client writes in MVP
create policy "Societies are world-readable"
on public.societies for select
using (true);

create policy "Activities are world-readable"
on public.activities for select
using (true);

-- Forum posts
create policy "Forum posts readable when published"
on public.forum_posts for select
using (
  status = 'published'
  or author_id = auth.uid()
);

create policy "Forum posts insert by author"
on public.forum_posts for insert
to authenticated
with check (author_id = auth.uid());

create policy "Forum posts update by author"
on public.forum_posts for update
to authenticated
using (author_id = auth.uid())
with check (author_id = auth.uid());

-- Forum replies
create policy "Forum replies readable if post visible"
on public.forum_replies for select
using (
  exists (
    select 1 from public.forum_posts p
    where p.id = forum_replies.post_id
      and (p.status = 'published' or p.author_id = auth.uid())
  )
);

create policy "Forum replies insert by author"
on public.forum_replies for insert
to authenticated
with check (author_id = auth.uid());

create policy "Forum replies update by author"
on public.forum_replies for update
to authenticated
using (author_id = auth.uid())
with check (author_id = auth.uid());

-- Reports
create policy "Reports insert by reporter"
on public.content_reports for insert
to authenticated
with check (reporter_id = auth.uid());

create policy "Reports select own"
on public.content_reports for select
to authenticated
using (reporter_id = auth.uid());
