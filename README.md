# MPloyChek — Digital Background Verification SPA

NSQTech Private Limited | Software Engineer Internship Code Challenge

---

## Tech Stack

| Layer     | Technology                                       |
|-----------|--------------------------------------------------|
| Frontend  | Angular 17 (module-based), Angular Material 17   |
| Backend   | Node.js 20 + Express 4 + TypeScript              |
| Storage   | JSON flat-file (local, zero-setup)               |
| Auth      | JWT (jsonwebtoken) + bcryptjs                    |

---

## Architecture

```
ProjectSPA/
├── backend/                     Node.js + TypeScript API (port 3000)
│   └── src/
│       ├── data/                users.json, records.json
│       ├── middleware/          auth.ts (JWT + role guards)
│       ├── routes/              auth.ts, users.ts, records.ts
│       ├── types/               shared interfaces
│       └── server.ts            entry point
│
└── frontend/                    Angular 17 SPA (port 4200)
    └── src/app/
        ├── core/                CoreModule — singleton services, guards, interceptors
        │   ├── guards/          AuthGuard, RoleGuard
        │   ├── interceptors/    AuthInterceptor (JWT), LoadingInterceptor
        │   └── services/        AuthService, UserService, RecordsService, LoadingService
        ├── shared/              SharedModule — Material modules, pipes, shared components
        └── features/            Lazy-loaded feature modules
            ├── auth/            LoginComponent (reactive form, demo shortcuts)
            ├── dashboard/       DashboardComponent (profile + records table + async delay)
            └── admin/           AdminComponent (user CRUD) + dialogs
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Install all dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Start the backend API (Terminal 1)

```bash
cd backend && npm run dev
# → API running at http://localhost:3000
# → Passwords will be bcrypt-hashed on first run
```

### 3. Start the Angular dev server (Terminal 2)

```bash
cd frontend && npm start
# → App running at http://localhost:4200
```

Or run both together from root (requires `concurrently`):

```bash
npm install && npm start
```

---

## Demo Credentials

All accounts use the same password: **`Pass@1234`**

| Username        | Role         | Access                          |
|-----------------|--------------|---------------------------------|
| `astha.admin`   | Admin        | All records + User management   |
| `bharti.admin`  | Admin        | All records + User management   |
| `surbhi.user`   | General User | Own records only                |
| `singh.user`    | General User | Own records only                |
| `sona.user`     | General User | Own records (Inactive)          |

---

## Key Features

### Authentication
- JWT-based login with bcrypt password verification
- Passwords auto-hashed from plain-text on first server run
- Token stored in localStorage, attached to every API request via `AuthInterceptor`
- Route guards: `AuthGuard` (protect all private routes), `RoleGuard` (Admin-only routes)

### Dashboard (General User & Admin)
- User profile card with all account details
- Verification records table with sorting, filtering, and pagination
- **Async loading showcase**: slider controls the API delay (0–5000ms) with visual spinner
- Access-level differentiation: Admins see all 8 records; General Users see only their assigned ones

### Admin Panel (Admin only)
- Full user CRUD: Create / Edit / Delete users
- Reactive forms with validation in a Material Dialog
- Real-time stats (total users, admin count, active count)
- Self-deletion protection, inactive account block

### Code Architecture Highlights
- `CoreModule` with `@SkipSelf` guard prevents duplicate instantiation
- `LoadingInterceptor` tracks all in-flight HTTP requests globally
- Feature modules are **lazy-loaded** for optimal bundle size
- All services use `BehaviorSubject` / `Observable` patterns throughout

---

## API Endpoints

```
POST   /api/auth/login              Public — returns JWT + user info
GET    /api/users/me                Auth — current user profile
GET    /api/users                   Admin only — all users
POST   /api/users                   Admin only — create user
PUT    /api/users/:id               Admin only — update user
DELETE /api/users/:id               Admin only — delete user
GET    /api/records?delay=0         Auth — records (role-filtered); delay param demos async
GET    /api/health                  Public — server health check
```
