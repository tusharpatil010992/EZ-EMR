# EMR Subscription Platform — Incremental MVP Architecture

This project is a **multi-tenant EMR (Electronic Medical Records) SaaS platform** built using a **monorepo approach** with:

- Frontend: Next.js
- Backend: Spring Boot
- Database: PostgreSQL

The goal is to start with a **simple modular monolith MVP** and evolve gradually into **microservices and microfrontends** when needed.

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

emr-platform/
│
├── frontend/ # Next.js App
├── backend/ # Spring Boot App
├── docs/
├── docker-compose.yml
└── README.md

This project is a **multi-tenant EMR (Electronic Medical Records) SaaS platform** built using a **monorepo approach** with:

- Frontend: Next.js
- Backend: Spring Boot
- Database: PostgreSQL

The goal is to start with a **simple modular monolith MVP** and evolve gradually into **microservices and microfrontends** when needed.

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
