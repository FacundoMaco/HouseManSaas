create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password text not null,
  created_at timestamp with time zone default now()
);

create table if not exists loads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null check (type in ('towels', 'sheets', 'mixed')),
  weight_lbs numeric not null,
  washer_started_at timestamp with time zone,
  washer_duration integer not null default 35,
  dryer_started_at timestamp with time zone,
  dryer_duration integer not null default 62,
  status text not null check (status in ('waiting', 'washing', 'drying', 'done')),
  notes text,
  created_at timestamp with time zone default now()
);

create index if not exists loads_user_id_idx on loads(user_id);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  label text not null,
  completed boolean not null default false,
  created_at timestamp with time zone default now()
);

create index if not exists tasks_user_id_idx on tasks(user_id);
