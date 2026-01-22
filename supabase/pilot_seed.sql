-- Replace the UUIDs with existing auth.users ids.
-- Example: select id, email from auth.users;

insert into profiles (id, full_name, role, on_shift)
values
  ('UUID_FRONTDESK', 'Front Desk', 'frontdesk', true),
  ('UUID_FACUNDO', 'Facundo', 'runner', true)
on conflict (id) do update
set full_name = excluded.full_name,
    role = excluded.role,
    on_shift = excluded.on_shift;
