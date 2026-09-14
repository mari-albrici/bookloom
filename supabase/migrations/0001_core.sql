create extension if not exists "pgcrypto";

create type public.reading_status as enum ('want_to_read', 'reading', 'read', 'paused', 'dnf', 'rereading');
create type public.visibility as enum ('private', 'followers', 'public');
create type public.data_origin as enum ('organic', 'community', 'editorial', 'derived', 'sponsored');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  display_name text not null,
  bio text,
  avatar_url text,
  profile_visibility public.visibility not null default 'public',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  description text,
  first_published_year smallint,
  editorial_source text,
  created_at timestamptz not null default now()
);

create table public.editions (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.works(id) on delete cascade,
  isbn10 text,
  isbn13 text,
  publisher text,
  publication_date date,
  language text,
  pages integer check (pages is null or pages > 0),
  cover_url text,
  format text,
  is_canonical boolean not null default false,
  created_at timestamptz not null default now(),
  unique (work_id, isbn13),
  unique (work_id, isbn10)
);

create table public.user_books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  work_id uuid not null references public.works(id) on delete cascade,
  edition_id uuid references public.editions(id) on delete set null,
  status public.reading_status not null default 'want_to_read',
  visibility public.visibility not null default 'private',
  started_at timestamptz,
  finished_at timestamptz,
  progress_pages integer not null default 0 check (progress_pages >= 0),
  progress_percent numeric(5,2) not null default 0 check (progress_percent between 0 and 100),
  reread_count integer not null default 0 check (reread_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, work_id, edition_id)
);

create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  work_id uuid not null references public.works(id) on delete cascade,
  overall numeric(2,1) not null check (overall between 0.5 and 5),
  dimensions jsonb not null default '{}'::jsonb,
  expectation text check (expectation in ('low', 'medium', 'high')),
  outcome text check (outcome in ('below', 'met', 'exceeded')),
  origin public.data_origin not null default 'community',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, work_id)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  work_id uuid not null references public.works(id) on delete cascade,
  rating_id uuid references public.ratings(id) on delete set null,
  body text not null check (char_length(body) <= 10000),
  contains_spoilers boolean not null default false,
  visibility public.visibility not null default 'public',
  arc_disclosure boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  work_id uuid references public.works(id) on delete cascade,
  entry_type text not null check (entry_type in ('note', 'quote', 'thought', 'prediction', 'character_note', 'favorite_passage', 'progress_update')),
  body text not null check (char_length(body) <= 10000),
  page integer check (page is null or page > 0),
  chapter text,
  progress_percent numeric(5,2) check (progress_percent is null or progress_percent between 0 and 100),
  is_private boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.book_dna_aggregate (
  work_id uuid primary key references public.works(id) on delete cascade,
  dimensions jsonb not null default '{}'::jsonb,
  sample_size integer not null default 0 check (sample_size >= 0),
  confidence numeric(5,2) not null default 0 check (confidence between 0 and 100),
  origin public.data_origin not null default 'derived',
  updated_at timestamptz not null default now()
);

create table public.promoted_campaigns (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.works(id) on delete cascade,
  organization_id uuid not null,
  status text not null default 'draft',
  start_at timestamptz,
  end_at timestamptz,
  targeting jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index works_title_search_idx on public.works using gin (to_tsvector('simple', title));
create index editions_isbn13_idx on public.editions (isbn13);
create index user_books_user_status_idx on public.user_books (user_id, status, updated_at desc);
create index ratings_work_idx on public.ratings (work_id);
create index journal_user_created_idx on public.journal_entries (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.user_books enable row level security;
alter table public.ratings enable row level security;
alter table public.reviews enable row level security;
alter table public.journal_entries enable row level security;

create policy "Public profiles are visible" on public.profiles for select using (profile_visibility = 'public' or id = auth.uid());
create policy "Users manage their profile" on public.profiles for all using (id = auth.uid()) with check (id = auth.uid());
create policy "Users manage their library" on public.user_books for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage their ratings" on public.ratings for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Public reviews are readable" on public.reviews for select using (visibility = 'public' or user_id = auth.uid());
create policy "Users manage their reviews" on public.reviews for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Journal is private by default" on public.journal_entries for all using (user_id = auth.uid()) with check (user_id = auth.uid());
