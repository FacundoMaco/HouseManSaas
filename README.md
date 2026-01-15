# HouseMen SaaS - MVP

SaaS web app minimalista y **completamente client-side** para gestionar cargas de lavandería y tareas diarias de personal de hotel.

## Stack Tecnológico

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **localStorage** (Persistencia local)
- **Vercel** (Deployment)

## Características

- ✅ **100% Client-Side** - Sin backend, sin base de datos, sin configuración
- ✅ Autenticación simple (usuario: `admin`, contraseña: `123pass`)
- ✅ Dashboard con cargas de lavandería activas
- ✅ Gestión de tareas diarias con checklist
- ✅ Timers persistentes para lavadora/secadora
- ✅ UI mobile-first y PWA-ready
- ✅ Diseño minimalista y operacional
- ✅ Datos guardados en localStorage del navegador

## Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Ejecutar Servidor de Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 3. Iniciar Sesión

- **Usuario:** `admin`
- **Contraseña:** `123pass`

¡Eso es todo! No necesitas configurar nada más.

## Estructura del Proyecto

```
src/
├── app/
│   ├── (protected)/      # Rutas protegidas
│   │   ├── dashboard/    # Dashboard principal
│   │   └── new-load/     # Crear nueva carga
│   └── login/            # Página de login
├── components/
│   ├── ui/               # Componentes UI base
│   ├── DashboardClient.tsx
│   ├── LoginForm.tsx
│   └── NewLoadForm.tsx
└── lib/
    ├── auth-simple.ts    # Autenticación simple
    └── storage.ts        # Gestión de localStorage
```

## Rutas Principales

- `/login` - Página de inicio de sesión
- `/dashboard` - Dashboard principal (protegida)
- `/new-load` - Crear nueva carga (protegida)

## Cómo Funciona

- **Autenticación:** Simple comparación de usuario/contraseña hardcodeada
- **Datos:** Todo se guarda en `localStorage` del navegador
- **Persistencia:** Los datos persisten entre sesiones en el mismo navegador
- **Timers:** Se actualizan automáticamente cada segundo

## Deployment en Vercel

1. Conecta tu repositorio a Vercel
2. Deploy automático - **No necesitas configurar variables de entorno**
3. Listo para usar

## Notas

- Los datos son locales al navegador (no se sincronizan entre dispositivos)
- Perfecto para uso interno de un solo usuario
- Si necesitas multi-usuario o sincronización, considera agregar un backend

## Licencia

MIT
