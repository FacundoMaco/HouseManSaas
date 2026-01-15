-- Crear usuario admin
-- Username: admin
-- Password: 123pass
-- 
-- Ejecuta este SQL en el SQL Editor de Supabase

INSERT INTO users (username, password) VALUES (
  'admin',
  '$2b$10$59R0Ob0qoyXVMfR0IOn6teTZiJtIQ2gbHh5bziuihm4iv0E.LGJk2'
)
ON CONFLICT (username) DO NOTHING;
