# Folder Structure Design — EZ-EMR Platform

## Context
Based on Architecture.md, ArchitectureRules.md, and DevelopmentRule.md:
- Monorepo, modular monolith backend, feature-based frontend
- No microservices, no extra databases, keep it simple
- Every business table needs `tenant_id`; walk-ins handled via flags, not a separate system

---

## Folder Structure

```
emr-platform/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   └── login/
│   │   │   │       └── page.tsx
│   │   │   ├── (protected)/
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── patients/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── appointments/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── subscription/
│   │   │   │       └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   │
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── api/
│   │   │   │   └── types/
│   │   │   ├── patient/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── api/
│   │   │   │   └── types/
│   │   │   ├── appointment/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── api/
│   │   │   │   └── types/
│   │   │   └── subscription/
│   │   │       ├── components/
│   │   │       ├── hooks/
│   │   │       ├── api/
│   │   │       └── types/
│   │   │
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── api/
│   │   │   ├── utils/
│   │   │   └── types/
│   │   │
│   │   └── middleware.ts
│   │
│   ├── public/
│   ├── .env.local
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/emr/
│   │   │   │   ├── modules/
│   │   │   │   │   ├── auth/
│   │   │   │   │   │   ├── controller/
│   │   │   │   │   │   ├── service/
│   │   │   │   │   │   ├── repository/
│   │   │   │   │   │   ├── entity/
│   │   │   │   │   │   ├── dto/
│   │   │   │   │   │   └── mapper/
│   │   │   │   │   ├── patient/
│   │   │   │   │   │   ├── controller/
│   │   │   │   │   │   ├── service/
│   │   │   │   │   │   ├── repository/
│   │   │   │   │   │   ├── entity/
│   │   │   │   │   │   ├── dto/
│   │   │   │   │   │   └── mapper/
│   │   │   │   │   ├── appointment/
│   │   │   │   │   │   ├── controller/
│   │   │   │   │   │   ├── service/
│   │   │   │   │   │   ├── repository/
│   │   │   │   │   │   ├── entity/
│   │   │   │   │   │   ├── dto/
│   │   │   │   │   │   └── mapper/
│   │   │   │   │   └── subscription/
│   │   │   │   │       ├── controller/
│   │   │   │   │       ├── service/
│   │   │   │   │       ├── repository/
│   │   │   │   │       ├── entity/
│   │   │   │   │       ├── dto/
│   │   │   │   │       └── mapper/
│   │   │   │   │
│   │   │   │   ├── shared/
│   │   │   │   │   ├── config/
│   │   │   │   │   ├── security/
│   │   │   │   │   ├── exception/
│   │   │   │   │   └── utils/
│   │   │   │   │
│   │   │   │   └── EmrApplication.java
│   │   │   │
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── db/
│   │   │           └── migration/
│   │   │
│   │   └── test/
│   │       └── java/com/emr/
│   │           └── modules/
│   │               ├── auth/
│   │               ├── patient/
│   │               ├── appointment/
│   │               └── subscription/
│   │
│   └── pom.xml
│
├── docs/
│   ├── Architecture.md
│   ├── ArchitectureRules.md
│   ├── DevelopmentRule.md
│   ├── FrontendRules.md
│   └── Theme-rules.md
│
├── docker-compose.yml
└── README.md
```

---

## Key Decisions

| Area | Decision | Rule Source |
|---|---|---|
| Frontend modules | `auth`, `patient`, `appointment`, `subscription` — feature-based, not component-based | ArchitectureRules #3 |
| Backend modules | Same 4 modules, each self-contained with its own layers | Architecture.md §5 |
| Cross-module comms | Only via service layer — no direct repository access across modules | ArchitectureRules #7 |
| No extra layers | No Redis, no queues, no event system | ArchitectureRules #1 |
| DB migrations | Flyway-style under `resources/db/migration/` | Single DB rule |
| Walk-in support | Handled inside `patient` and `appointment` modules via flags | ArchitectureRules #6 |
