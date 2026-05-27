# 🏢 MPloyChek — Employee Background Verification System

A full-stack background verification platform that allows HR teams to submit, track, and manage employee background checks. Features a secure REST API backend and an Angular dashboard frontend.

## 🎯 Problem It Solves

Manual background verification is slow, untracked, and error-prone. MPloyChek digitizes the entire process — from submitting a check request to viewing verified records — in one secure, role-protected platform.

## ✨ Features

- **Role-based Access** — Separate views for Admin and HR users
- **Background Check Requests** — Submit and track verification requests per employee
- **Records Management** — View, search, and manage verified employee records
- **JWT Authentication** — Secure login with token-based sessions
- **RESTful API** — Clean backend API with TypeScript for type safety
- **Angular Dashboard** — Responsive UI with real-time status updates

## 🛠️ Tech Stack

**Frontend**
![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat-square&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)

**Backend**
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)

| Layer | Technology |
|-------|-----------|
| Frontend | Angular, TypeScript |
| Backend | Node.js, Express.js, TypeScript |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Storage | JSON file store (records.json, users.json) |
| API | REST |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Angular CLI (`npm install -g @angular/cli`)

### Backend Setup

```bash
cd backend
npm install
npm run dev        # Development with ts-node-dev
npm run build      # Compile TypeScript
npm start          # Run compiled JS
```

### Frontend Setup

```bash
cd frontend
npm install
ng serve           # Runs on http://localhost:4200
```

## 📁 Project Structure

```
MPloyChek/
├── backend/
│   ├── src/
│   │   ├── server.ts           # Express app entry point
│   │   ├── routes/
│   │   │   ├── auth.ts         # Login/register routes
│   │   │   ├── records.ts      # Background check CRUD
│   │   │   └── users.ts        # User management
│   │   ├── middleware/
│   │   │   └── auth.ts         # JWT verification middleware
│   │   ├── utils/
│   │   │   └── fileStore.ts    # JSON file-based data store
│   │   ├── types/
│   │   │   └── index.ts        # TypeScript interfaces
│   │   └── data/
│   │       ├── records.json    # Persisted background check records
│   │       └── users.json      # Persisted user accounts
│   └── package.json
│
├── frontend/
│   ├── src/app/
│   │   ├── app-routing.module.ts
│   │   └── app.component.ts
│   └── angular.json
│
└── api/
    └── index.ts               # Serverless API entry (Vercel)
```

## 📡 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/login` | None | Login, receive JWT |
| POST | `/api/auth/register` | None | Register new user |
| GET | `/api/records` | Bearer | Get all background records |
| POST | `/api/records` | Bearer | Submit new background check |
| GET | `/api/users` | Admin | List all users |

## 🔒 Security

- Passwords hashed with bcryptjs
- Protected routes verified via JWT middleware
- Role-based authorization (Admin vs HR)

## 📄 License

MIT © [Astha Bharti](https://github.com/astha9900)
