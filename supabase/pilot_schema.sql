create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('frontdesk', 'runner', 'manager')),
  on_shift boolean default false,
  created_at timestamp with time zone default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('towels', 'ice', 'trash', 'amenities', 'hallway_check', 'custom')),
  room text,
  note text,
  priority text not null check (priority in ('normal', 'urgent')),
  status text not null check (status in ('pending', 'in_progress', 'done')),
  assigned_to uuid not null references profiles(id) on delete set null,
  created_by uuid not null references profiles(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists profiles_role_idx on profiles(role);
create index if not exists profiles_on_shift_idx on profiles(on_shift);
create index if not exists tasks_assigned_to_idx on tasks(assigned_to);
create index if not exists tasks_created_by_idx on tasks(created_by);
create index if not exists tasks_status_idx on tasks(status);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists tasks_set_updated_at on tasks;
create trigger tasks_set_updated_at
before update on tasks
for each row execute function set_updated_at();

alter table profiles enable row level security;
alter table tasks enable row level security;

drop policy if exists "profiles_read_own" on profiles;
create policy "profiles_read_own"
  on profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_read_all_frontdesk_manager" on profiles;
create policy "profiles_read_all_frontdesk_manager"
  on profiles for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and p.role in ('frontdesk', 'manager')
    )
  );

drop policy if exists "tasks_insert_frontdesk_manager" on tasks;
create policy "tasks_insert_frontdesk_manager"
  on tasks for insert
  with check (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and p.role in ('frontdesk', 'manager')
    )
    and created_by = auth.uid()
  );

drop policy if exists "tasks_read_frontdesk_manager" on tasks;
create policy "tasks_read_frontdesk_manager"
  on tasks for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and p.role in ('frontdesk', 'manager')
    )
  );

drop policy if exists "tasks_read_runner" on tasks;
create policy "tasks_read_runner"
  on tasks for select
  using (assigned_to = auth.uid());

drop policy if exists "tasks_update_runner" on tasks;
create policy "tasks_update_runner"
  on tasks for update
  using (assigned_to = auth.uid())
  with check (assigned_to = auth.uid());
