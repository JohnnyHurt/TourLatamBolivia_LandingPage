# Tour LATAM Bolivia 2026 — Plataforma Web Oficial

**Congreso Internacional de Dirección de Proyectos**  
*PMO · Agilidad · Inteligencia Artificial*  
📅 20 y 21 de Noviembre, 2026 · Modalidad Virtual · Organizado por PMI Bolivia Chapter

---

## 🏗️ Arquitectura del Monorepo

```
TourLatamLandingPage/
├── apps/
│   ├── api/          → Backend Express + Prisma (Node.js)
│   └── web/          → Frontend React + Vite + Tailwind CSS
├── packages/
│   └── types/        → DTOs y tipos compartidos TypeScript
├── prisma/
│   ├── schema.prisma → Modelo de base de datos (SQLite dev / PostgreSQL prod)
│   └── seed.ts       → Datos iniciales del evento
└── uploads/          → Archivos subidos (ignorado por git)
```

## 🚀 Setup para Colaboradores

### Requisitos
- Node.js 20+
- npm 10+

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_ORG/TourLatamLandingPage.git
cd TourLatamLandingPage
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus valores locales
```

Las variables clave en `.env`:
```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="un-secreto-local-seguro"
PORT=4000
NODE_ENV=development
```

### 4. Inicializar la base de datos
```bash
# Crear la base de datos y aplicar el schema
npm run db:push

# Sembrar datos iniciales del evento
npm run db:seed
```

### 5. Ejecutar en desarrollo

**Terminal 1 — API Backend (puerto 4000):**
```bash
npm run dev --workspace=apps/api
```

**Terminal 2 — Web Frontend (puerto 3000 o 3001):**
```bash
npm run dev --workspace=apps/web
```

Luego abrir: **http://localhost:3000** (landing pública)  
Admin CMS: **http://localhost:3000/admin** (usuario: `admin@pmi-bolivia.org` / pass del seed)

---

## 📦 Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev --workspace=apps/api` | API en modo desarrollo con hot-reload |
| `npm run dev --workspace=apps/web` | Frontend Vite en modo desarrollo |
| `npm run build --workspace=apps/api` | Compilar API a JavaScript |
| `npm run build --workspace=apps/web` | Build de producción del frontend |
| `npm run typecheck --workspace=apps/web` | Verificar TypeScript del frontend |
| `npm run db:push` | Aplicar schema Prisma sin migraciones |
| `npm run db:seed` | Sembrar datos de prueba del evento |
| `npm run db:studio` | Abrir Prisma Studio (UI de base de datos) |

---

## 🎨 Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | React 18 + TypeScript + Vite + Tailwind CSS |
| **Tipografía** | Barlow Condensed + Barlow (Google Fonts) |
| **Backend** | Node.js + Express + TypeScript |
| **ORM** | Prisma 5 |
| **Base de datos** | SQLite (desarrollo) / PostgreSQL (producción) |
| **Auth** | JWT con bcrypt |
| **Validación** | Zod |
| **Iconos** | Lucide React |

---

## 🗂️ Estructura del CMS Backoffice

El CMS en `/admin` permite gestionar sin tocar código:

- **Speakers** — Crear, editar y ordenar ponentes con foto y bio
- **Agenda** — Sesiones por jornada (20 y 21 Nov) con tipo de sesión
- **Sponsors** — Patrocinadores por tier (Title, Gold, Silver, Bronze)
- **Tickets / Precios** — Categorías de pase con fechas de vigencia
- **Configuración del Evento** — Datos globales, CTAs, URLs
- **Usuarios** — Gestión de accesos (rol Admin / Editor)
- **Audit Logs** — Historial de cambios del sistema

---

## 🤝 Guía de Contribución

1. Crear una rama desde `main`:
   ```bash
   git checkout -b feature/nombre-de-tu-feature
   ```

2. Hacer cambios y verificar que TypeScript pase:
   ```bash
   npm run typecheck --workspace=apps/web
   npm run build --workspace=apps/api
   ```

3. Abrir un Pull Request hacia `main` con descripción del cambio.

### Paleta de colores oficial
| Token Tailwind | Hex | Uso |
|---|---|---|
| `dark-900` | `#0B0418` | Fondo principal |
| `brand-cyan` | `#00F2FE` | Acentos, bordes activos |
| `brand-magenta` | `#FF007F` | Badges, énfasis secundario |
| `brand-purple` | `#7928CA` | Cards, gradientes |
| `brand-pmiOrange` | `#FF5E14` | Botones CTA primarios |

---

## 📄 Licencia

Proyecto desarrollado para **PMI Bolivia Chapter** — Todos los derechos reservados.
