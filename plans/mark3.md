# EZ-EMR — Implementation Plan (mark3)

## Overview
Full implementation of multi-tenant EMR SaaS platform per mark2.md requirements.
Monorepo: Spring Boot 3.5 backend + Next.js 16 frontend + PostgreSQL.

## Architecture Rules
- Modular monolith — no microservices, Kafka, Redis, CQRS
- Feature modules: controller/ service/ repository/ entity/ dto/ mapper/
- No cross-module repository access
- All business tables have tenant_id UUID NOT NULL
- Walk-ins: patients.is_walkin + appointments.is_walkin (appointment_time nullable)
- Next.js 16: Middleware = proxy.ts (not middleware.ts)

## Roles
SUPER_ADMIN (platform), ADMIN (tenant), DOCTOR (own appointments), STAFF (appointments/queue)

---

## Phase 1 — Backend Foundation

### pom.xml
- Add: jjwt-api/impl/jackson 0.12.6, springdoc-openapi-starter-webmvc-ui 2.8.8

### application.yml
- Add app.jwt.* config block, remove spring.security.user block

### DB Migrations
- V2: tenants, subscription_plans, users tables
- V3: ALTER appointments (add doctor_id, notes, cancel_reason, deleted_at), ALTER patients (add deleted_at), ALTER subscriptions (add plan FK, start_date)

### Shared Security (com.emr.shared.security)
- JwtProperties — @ConfigurationProperties("app.jwt")
- JwtService — generate/validate access+refresh tokens (HMAC-SHA256)
- JwtAuthFilter — OncePerRequestFilter, sets SecurityContext from Bearer token
- UserDetailsServiceImpl — loads from UserRepository.findByEmail()
- AuthEntryPoint — 401 JSON response
- AccessDeniedHandlerImpl — 403 JSON response
- AuthenticatedUserContext — utility to get current user/tenantId/role from SecurityContext
- SecurityConfig update — JWT filter chain, BCrypt bean, AuthManager bean, @EnableMethodSecurity

### Shared Exception
- BusinessRuleException — 422 Unprocessable Entity
- Update GlobalExceptionHandler — handle AccessDeniedException, BadCredentialsException, BusinessRuleException

---

## Phase 2 — Backend Modules

### User Module (com.emr.modules.user)
- Role enum: SUPER_ADMIN, ADMIN, DOCTOR, STAFF
- User entity: id, tenantId (nullable for SA), email, passwordHash, fullName, role, active, firstLoginPasswordResetRequired
- CRUD: POST/GET/PUT /api/users (tenant-scoped)

### Tenant Module (com.emr.modules.tenant)
- Tenant entity: id, name, status (ACTIVE/INACTIVE), subscriptionPlanId
- TenantService: create, list, activate/deactivate

### Auth Module (com.emr.modules.auth)
- Complete AuthService: login (BCrypt verify → JWT), refresh token, change password
- New DTOs: RefreshTokenRequest, ChangePasswordRequest, AuthResponse
- Endpoints: POST /auth/login, POST /auth/refresh, POST /auth/change-password

### SuperAdmin Module (com.emr.modules.superadmin)
- SuperAdminBootstrap: ApplicationRunner, creates SUPER_ADMIN on startup if absent
- TenantOnboardingService: @Transactional — create tenant + assign plan + create ADMIN user + return credentials
- SuperAdminController: @PreAuthorize(SA) — tenant CRUD, subscription plan CRUD

### SubscriptionPlan (extend com.emr.modules.subscription)
- SubscriptionPlan entity: id, name, billingCycle (MONTHLY/YEARLY), price, maxDoctors, active
- CRUD endpoints (SA only)

### Appointment Module (complete)
- Add: doctorId, notes, cancelReason, deletedAt to Appointment entity
- Status: SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
- Full CRUD with @PreAuthorize per role
- Overlap validation (same doctor within 30min window)
- Walk-in queue endpoint
- Pagination + filtering with JPA Specification

### Patient Module (complete)
- Add: deletedAt to Patient entity
- POST/PUT/DELETE (soft) /api/patients with tenant scoping

---

## Phase 3 — Frontend

### Next.js 16 Patterns
- Proxy (proxy.ts) = middleware (already exists, checks auth_token cookie)
- Server Components default — use for data display
- Client Components ('use client') — for interactive forms
- Server Actions ('use server') — for form mutations
- Cookies API (server-side) — for secure JWT storage

### Package additions
- zod (validation in server actions)

### Auth Flow
- LoginForm: Server Action sets auth_token httpOnly cookie → redirect by role
- ChangePasswordForm: Server Action calls API, clears cookie on completion
- Logout: Server Action clears auth_token cookie
- proxy.ts: already handles auth gate + role redirect

### API Client (shared/api/client.ts)
- Server-side: reads cookies() for auth header
- Client-side: reads document.cookie for auth header
- Unified typed helpers

### Session (shared/lib/session.ts)
- getSession() — reads auth_token cookie, decodes JWT payload
- setSession(token) — sets auth_token httpOnly cookie
- clearSession() — deletes auth_token cookie

### Common Components (add to shared/components/)
- StatusBadge — extends Badge with appointment/tenant status mapping
- ConfirmModal — wraps Modal with confirm/cancel buttons
- EmptyState — empty list UI with message and optional action
- LoadingSpinner — centered spinner
- SearchableSelect — async-capable dropdown for patient/doctor selection
- Pagination — page controls component
- Toast — client-side toast notification (useToast hook)
- Select — standard select input (reusable form element)
- Textarea — standard textarea input
- FormField — label + input + error wrapper (DRY pattern)

### Role-based Sidebar
- Reads role from session cookie (decoded JWT)
- NAV_ITEMS_BY_ROLE map — different links per role

### Module UIs
- Auth: LoginForm wired, ChangePasswordPage new
- SuperAdmin: TenantList, TenantOnboardingForm, SubscriptionPlanList, SubscriptionPlanForm
- Admin: UserList, CreateUserForm, AppointmentList (wired), WalkInQueue
- Doctor: MyAppointments, WalkInQueue
- Staff: AppointmentBookingForm, WalkInRegistrationForm, QueueView

---

## Authorization Matrix
| Endpoint | SA | ADMIN | DOCTOR | STAFF |
|---|---|---|---|---|
| POST /auth/login | ✓ | ✓ | ✓ | ✓ |
| POST /super-admin/tenants | ✓ | | | |
| POST /super-admin/subscription-plans | ✓ | | | |
| POST /users | ✓ | ✓ | | |
| POST /appointments | ✓ | ✓ | | ✓ |
| PATCH /appointments/{id}/start | ✓ | ✓ | ✓ | |
| PATCH /appointments/{id}/complete | ✓ | | ✓ | |
| PATCH /appointments/{id}/cancel | ✓ | ✓ | | ✓ |

## Verification
1. `cd backend && mvn compile` — clean build
2. Start docker-compose, verify Flyway V2+V3 run
3. Check startup logs for SUPER_ADMIN credentials
4. POST /api/auth/login → JWT response
5. POST /api/super-admin/tenants → tenant + admin credentials
6. POST /api/appointments with overlapping time → 422
7. Open http://localhost:3000/login → login → role-based redirect
