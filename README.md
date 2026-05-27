## MPloyChek — Digital Background Verification SPA

### Tech Stack

* **Frontend:** Angular 17 + Angular Material
* **Backend:** Node.js, Express, TypeScript
* **Authentication:** JWT + bcrypt
* **Storage:** Local JSON-based database

### Features

* Secure JWT authentication with role-based access
* Admin and user dashboards with protected routes
* Verification records management with filtering, sorting, and pagination
* Admin panel for complete user CRUD operations
* Global loading interceptor with async API delay simulation
* Lazy-loaded Angular modules for better performance
* Reactive forms and observable-based architecture

### Roles

* **Admin:** Manage users and access all verification records
* **General User:** Access only assigned records

### API Highlights

* Login authentication
* User profile management
* Admin-only user CRUD APIs
* Role-filtered verification records endpoint
* Health monitoring endpoint

### Architecture

* Angular SPA with modular structure (`CoreModule`, `SharedModule`, feature modules)
* Express REST API with JWT middleware and role guards
* Clean separation of services, guards, interceptors, and routes

### Quick Start

1. Install dependencies for frontend and backend
2. Run backend on `localhost:3000`
3. Run Angular frontend on `localhost:4200`

A scalable and production-style SPA showcasing authentication, authorization, reactive programming, and clean full-stack architecture.
