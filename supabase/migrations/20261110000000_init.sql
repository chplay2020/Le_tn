create type tier as enum ('special','friend','bestie');
create type rsvp_status as enum ('yes','no');

create table guests (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null check (char_length(name) between 1 and 100),
  tier tier not null default 'friend',
  personal_message text check (char_length(personal_message) <= 1000),
  created_at timestamptz not null default now()
);
create table rsvps (
  guest_id uuid primary key references guests(id) on delete cascade,
  status rsvp_status not null,
  wish text check (char_length(wish) <= 300),
  updated_at timestamptz not null default now()
);
create table gallery (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  sort_order int not null default 0
);
create table settings (key text primary key, value text not null);

alter table guests enable row level security;
alter table rsvps enable row level security;
alter table gallery enable row level security;
alter table settings enable row level security;
revoke all on guests, rsvps, gallery, settings from anon, authenticated;

insert into storage.buckets (id, name, public) values ('gallery','gallery', true) on conflict do nothing;
