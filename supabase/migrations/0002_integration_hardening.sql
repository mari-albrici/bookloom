alter table public.works
  add column if not exists authors text[] not null default '{}',
  add column if not exists provider text not null default 'openlibrary',
  add column if not exists provider_id text not null default '';

alter table public.works
  add constraint works_provider_check check (provider in ('openlibrary', 'google-books'));

create unique index if not exists works_provider_identity_idx
  on public.works (provider, provider_id)
  where provider_id <> '';

create unique index if not exists user_books_without_edition_idx
  on public.user_books (user_id, work_id)
  where edition_id is null;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists user_books_set_updated_at on public.user_books;
create trigger user_books_set_updated_at before update on public.user_books
for each row execute function public.set_updated_at();

drop trigger if exists ratings_set_updated_at on public.ratings;
create trigger ratings_set_updated_at before update on public.ratings
for each row execute function public.set_updated_at();

drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at before update on public.reviews
for each row execute function public.set_updated_at();

alter table public.works enable row level security;
alter table public.editions enable row level security;
alter table public.book_dna_aggregate enable row level security;

create policy "Works are readable" on public.works for select using (true);
create policy "Editions are readable" on public.editions for select using (true);
create policy "Book DNA is readable" on public.book_dna_aggregate for select using (true);
