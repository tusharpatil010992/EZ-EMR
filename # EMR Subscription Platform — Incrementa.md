# EMR Subscription Platform — Incremental MVP Architecture

This project is a **multi-tenant EMR (Electronic Medical Records) SaaS platform** built using a **monorepo approach** with:

- Frontend: Next.js
- Backend: Spring Boot
- Database: PostgreSQL

The goal is to start with a **simple modular monolith MVP** and evolve gradually into **microservices and microfrontends** when needed.

---

# 1. System Overview

## Architecture Style

- Monorepo
- Modular Monolith (Backend)
- Feature-based Frontend (Next.js)
- Single Database (PostgreSQL)

## High-Level Flow

Frontend (Next.js)
↓
Backend (Spring Boot REST APIs)
↓
PostgreSQL

---

# 2. Monorepo Structure

# EMR Subscription Platform — Incremental MVP Architecture

This project is a **multi-tenant EMR (Electronic Medical Records) SaaS platform** built using a **monorepo approach** with:

- Frontend: Next.js
- Backend: Spring Boot
- Database: PostgreSQL

The goal is to start with a **simple modular monolith MVP** and evolve gradually into **microservices and microfrontends** when needed.

---

# 1. System Overview

## Architecture Style

- Monorepo
- Modular Monolith (Backend)
- Feature-based Frontend (Next.js)
- Single Database (PostgreSQL)

## High-Level Flow

Frontend (Next.js)
↓
Backend (Spring Boot REST APIs)
↓
PostgreSQL

---

# 2. Monorepo Structure

# EMR Subscription Platform — Incremental MVP Architecture

This project is a **multi-tenant EMR (Electronic Medical Records) SaaS platform** built using a **monorepo approach** with:

- Frontend: Next.js
- Backend: Spring Boot
- Database: PostgreSQL

The goal is to start with a **simple modular monolith MVP** and evolve gradually into **microservices and microfrontends** when needed.

---

# 1. System Overview

## Architecture Style

- Monorepo
- Modular Monolith (Backend)
- Feature-based Frontend (Next.js)
- Single Database (PostgreSQL)

## High-Level Flow

Frontend (Next.js)
↓
Backend (Spring Boot REST APIs)
↓
PostgreSQL

---

# 2. Monorepo Structure

emr-platform/
│
├── frontend/ # Next.js App
├── backend/ # Spring Boot App
├── docs/
├── docker-compose.yml
└── README.md

---

# 3. Frontend Architecture (Next.js)

## Structure

frontend/
│
├── src/
│ ├── app/
│ ├── modules/
│ │ ├── auth/
│ │ ├── patient/
│ │ ├── appointment/
│ │ └── subscription/
│ │
│ ├── shared/
│ │ ├── components/
│ │ ├── api/
│ │ ├── utils/
│ │ └── types/
│ │
│ └── middleware.ts

## Pages (MVP)

/login
/dashboard
/patients
/appointments
/subscription

---

# 4. Backend Architecture (Spring Boot)

## Structure

backend/
│
├── src/main/java/com/emr/
│
│ ├── modules/
│ │ ├── auth/
│ │ ├── patient/
│ │ ├── appointment/
│ │ └── subscription/
│ │
│ ├── shared/
│ │ ├── config/
│ │ ├── security/
│ │ ├── exception/
│ │ └── utils/
│ │
│ └── EmrApplication.java

---

# 5. Backend Module Structure

Each module follows:
module/
│
├── controller/
├── service/
├── repository/
├── entity/
├── dto/
└── mapper/

Rule:
Each module must be isolated and communicate only via service layer.

---

# 6. Initial Modules (MVP)

Start with:

| Module       | Purpose              |
| ------------ | -------------------- |
| auth         | Login / Registration |
| patient      | Patient management   |
| appointment  | Scheduling system    |
| subscription | SaaS plans           |

---

# 7. Database Design

## Database

- PostgreSQL (single database)

## Multi-Tenancy

Use `tenant_id` in all business tables:

Rule:
Each module must be isolated and communicate only via service layer.

---

# 6. Initial Modules (MVP)

Start with:

| Module       | Purpose              |
| ------------ | -------------------- |
| auth         | Login / Registration |
| patient      | Patient management   |
| appointment  | Scheduling system    |
| subscription | SaaS plans           |

---

# 7. Database Design

## Database

- PostgreSQL (single database)

## Multi-Tenancy

Use `tenant_id` in all business tables:
patients
appointments
subscriptions
users

Example:

No separate databases per tenant in MVP.

---

# 8. Authentication

- JWT-based authentication
- Email + Password login

## Roles

ADMIN
DOCTOR
STAFF

---

# 9. API Structure

/api/v1/auth
/api/v1/patients
/api/v1/appointments
/api/v1/subscriptions

---

# 10. File Storage (MVP)

- Local file storage initially
- Later migrate to S3 / MinIO

Used for:

- Prescriptions
- Reports
- Medical documents

---

# 11. Docker Setup

```yaml
services:

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"

  backend:
    build: ./backend
    ports:
      - "8080:8080"

  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: emr
      POSTGRES_USER: emr
      POSTGRES_PASSWORD: emr
    ports:
      - "5432:5432"


12. Incremental Development Plan
Phase 1 — Foundation
Authentication
Tenant setup
Subscription module
Basic dashboard
Phase 2 — Core EMR
Patient management
Appointment scheduling
Phase 3 — Clinical
Medical notes
Prescriptions
Vitals tracking
Phase 4 — Billing
Invoices
Payments
Subscription lifecycle

13. Design Rules
DO
Keep modules isolated
Use DTOs for API communication
Maintain clean architecture
Build feature-by-feature
DO NOT
No microservices (initially)
No Kafka / messaging queues
No Redis caching
No Kubernetes
No event-driven complexity
No CQRS
14. Frontend Principles
Feature-based modular structure
Shared reusable components
Centralized API layer
Strong TypeScript typing
15. Backend Principles
Modular monolith architecture
Layered structure
Service-based internal communication
Clean separation of concerns
```
