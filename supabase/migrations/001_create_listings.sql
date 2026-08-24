-- Run this in Supabase Dashboard > SQL Editor before deploying.
create extension if not exists "uuid-ossp";

create table if not exists public.listings (
  id uuid primary key default uuid_generate_v4(),
  title text not null check (char_length(title) between 2 and 120),
  property_type text not null check (property_type in ('PG', 'Room', 'Hostel', 'Flat')),
  description text not null check (char_length(description) between 10 and 1500),
  area text not null,
  address text not null,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  rent integer check (rent >= 0),
  available_beds integer not null check (available_beds > 0 and available_beds < 100),
  contact_name text not null,
  contact_phone text not null check (char_length(contact_phone) between 10 and 20),
  created_at timestamptz not null default now()
);

alter table public.listings enable row level security;

-- Initial MVP policy: visitors can view and add vacancies.
-- Before a public launch, replace the insert policy with authenticated owner accounts.
create policy "Anyone can read listings" on public.listings for select using (true);
create policy "Anyone can add a listing" on public.listings for insert with check (true);
