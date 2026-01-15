# HouseMen SaaS - MVP

SaaS web app minimalista para gestionar cargas de lavandería y tareas diarias de personal de hotel.

## Stack Tecnológico

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (PostgreSQL)
- **Vercel** (Deployment)

## Características

- ✅ Autenticación simple con usuarios y contraseñas
- ✅ Dashboard con cargas de lavandería activas
- ✅ Gestión de tareas diarias con checklist
- ✅ Timers persistentes para lavadora/secadora
- ✅ UI mobile-first y PWA-ready
- ✅ Diseño minimalista y operacional

## Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_de_supabase
SESSION_SECRET=una_cadena_secreta_aleatoria
```

### 2. Base de Datos

Ejecuta el script SQL en tu proyecto de Supabase:

```bash
# El archivo está en: supabase/schema.sql
```

Este script crea las tablas:
- `users` - Usuarios del sistema
- `loads` - Cargas de lavandería
- `tasks` - Tareas diarias

### 3. Crear Primer Usuario

Necesitas crear un usuario manualmente en Supabase. Puedes usar este script Node.js temporal:

```bash
node -e "
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('tu_contraseña', 10);
console.log('INSERT INTO users (username, password) VALUES (\\'admin\\', \\'' + hash + '\\');');
"
```

Luego ejecuta el INSERT en Supabase SQL Editor.

### 4. Instalar Dependencias

```bash
npm install
```

### 5. Ejecutar Servidor de Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
src/
├── app/
│   ├── (protected)/      # Rutas protegidas
│   │   ├── dashboard/    # Dashboard principal
│   │   └── new-load/     # Crear nueva carga
│   ├── api/              # API routes
│   │   ├── login/        # Autenticación
│   │   ├── loads/        # CRUD de cargas
│   │   └── tasks/        # CRUD de tareas
│   └── login/            # Página de login
├── components/
│   ├── ui/               # Componentes UI base
│   ├── DashboardClient.tsx
│   ├── LoginForm.tsx
│   └── NewLoadForm.tsx
└── lib/
    ├── auth.ts           # Helpers de autenticación
    ├── session.ts        # Gestión de sesiones
    └── supabase*.ts      # Clientes de Supabase
```

## Rutas Principales

- `/login` - Página de inicio de sesión
- `/dashboard` - Dashboard principal (protegida)
- `/new-load` - Crear nueva carga (protegida)

## Deployment en Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel
3. Deploy automático en cada push a `main`

## Licencia

MIT
