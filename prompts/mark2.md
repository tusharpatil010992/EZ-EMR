```text id="v8m2qa"
You are a senior enterprise software architect and full-stack engineer.

Generate production-grade implementation for a multi-tenant EMR SaaS platform.

Follow all existing project architecture, coding standards, module conventions, package structure, folder organization, and development rules already defined in the project documentation.

IMPORTANT:
- Do NOT generate project architecture explanation
- Do NOT generate monorepo explanation
- Do NOT generate database schema explanation
- Do NOT generate theory
- Generate implementation-focused output only
- Generate production-ready code only

==================================================
CORE REQUIREMENTS
==================================================

The application is a multi-tenant EMR SaaS platform.

Roles:

1. SUPER_ADMIN
2. ADMIN
3. DOCTOR
4. STAFF

==================================================
SUPER ADMIN REQUIREMENTS
==================================================

The system must support a platform-level SUPER_ADMIN.

IMPORTANT:

If SUPER_ADMIN does NOT exist:
- Spring Boot application must automatically create default SUPER_ADMIN during application startup
- Use ApplicationRunner or CommandLineRunner
- Auto-create happens only once
- Password must be generated automatically as a strong random string password
- Password must be BCrypt hashed before saving
- Generated credentials should be logged securely during startup
- Avoid duplicate SUPER_ADMIN creation

SUPER_ADMIN capabilities:
- Access entire application
- Cross-tenant visibility
- Manage all tenants
- Manage subscription plans
- View all subscriptions
- Activate/deactivate tenants
- Create tenants
- Reset tenant admin password
- Access tenant analytics/dashboard

==================================================
TENANT ONBOARDING REQUIREMENTS
==================================================

When SUPER_ADMIN creates a new tenant:

Spring Boot backend must automatically:

1. Create tenant
2. Assign subscription plan
3. Create default tenant ADMIN user
4. Generate random temporary password
5. Hash password using BCrypt
6. Save generated ADMIN credentials
7. Associate ADMIN with tenant
8. Mark firstLoginPasswordResetRequired = true
9. Return generated credentials securely in response

Generated tenant ADMIN:
- Belongs only to that tenant
- Can login immediately
- Must change password on first login
- Can create/manage tenant users

==================================================
TENANT ADMIN REQUIREMENTS
==================================================

Tenant ADMIN can:

- Create DOCTOR users
- Create STAFF users
- Manage users within own tenant
- Manage appointments
- Manage walk-ins
- Manage patients
- View tenant reports
- Cannot access other tenants

==================================================
DOCTOR REQUIREMENTS
==================================================

DOCTOR can:
- Access only own appointments
- View assigned patients
- Mark appointments completed
- View walk-in queue assigned to them

==================================================
STAFF REQUIREMENTS
==================================================

STAFF can:
- Create appointments
- Manage walk-ins
- Update appointments
- Manage patient queue
- View appointment lists

==================================================
SECURITY REQUIREMENTS
==================================================

Implement enterprise-grade security using:

- Spring Security
- JWT Authentication
- Role-based authorization
- Method-level authorization
- BCryptPasswordEncoder
- JWT filters
- AuthenticationEntryPoint
- AccessDeniedHandler
- Tenant-aware authorization

Use:
- @PreAuthorize
- SecurityContextHolder
- JWT access token
- Refresh token support

==================================================
AUTHENTICATION REQUIREMENTS
==================================================

Generate:

1. Login API
2. JWT token generation
3. Refresh token API
4. Password change API
5. First-login password reset flow
6. Secure password hashing
7. JWT validation filter
8. Authenticated user context utility

==================================================
SUBSCRIPTION PLAN REQUIREMENTS
==================================================

SUPER_ADMIN must manage subscription plans.

Generate:

- Create subscription plan
- Update subscription plan
- Enable/disable subscription plan
- List subscription plans
- Assign plan to tenant
- Subscription lifecycle handling

Support:
- MONTHLY
- YEARLY

==================================================
APPOINTMENT MODULE REQUIREMENTS
==================================================

Generate complete Appointment module.

Features:
1. Create appointment
2. Update appointment
3. Cancel appointment
4. Complete appointment
5. Start appointment
6. Appointment listing
7. Appointment filtering
8. Pagination
9. Walk-in queue management

==================================================
WALK-IN SUPPORT
==================================================

Support walk-in patients.

Rules:
- Walk-ins may not have appointment time initially
- is_walkin identifies walk-ins
- Walk-ins appear in queue separately
- Walk-ins can later receive consultation time
- Walk-ins still belong to tenant

==================================================
BUSINESS RULES
==================================================

1. All queries must be tenant-aware
2. SUPER_ADMIN bypasses tenant restriction
3. ADMIN limited to own tenant
4. DOCTOR limited to own appointments
5. STAFF limited to assigned operations
6. Prevent overlapping doctor appointments
7. Cancelled appointments cannot be modified
8. Use UTC timestamps
9. Use audit fields
10. Use soft-delete/cancel strategy where applicable
11. Use UUID identifiers
12. Passwords must never be stored plain text
13. Random password generation required
14. First login password reset mandatory for generated users

==================================================
BACKEND REQUIREMENTS
==================================================

Generate production-grade Spring Boot code for:

AUTH MODULE
- Login
- JWT generation
- Refresh token
- Password reset
- Security configuration
- JWT filter
- UserDetailsService
- Authentication manager

SUPER ADMIN MODULE
- Super admin bootstrap logic
- Tenant management
- Subscription plan management
- Tenant activation/deactivation

TENANT MODULE
- Tenant management
- Tenant onboarding
- Tenant status management

USER MODULE
- User management
- Role management
- Password hashing
- Tenant-scoped users

SUBSCRIPTION MODULE
- Subscription plan CRUD
- Tenant subscription assignment
- Subscription lifecycle handling

APPOINTMENT MODULE
- Appointment management
- Walk-in handling
- Queue management

Generate:
- Entity
- DTO
- Repository
- Service
- ServiceImpl
- Mapper
- Controller
- Validation
- Exception handling
- Swagger/OpenAPI annotations
- JPQL/specification filtering
- Pagination support
- Audit handling

==================================================
FRONTEND REQUIREMENTS
==================================================

Generate production-grade Next.js frontend.

Generate:

AUTH UI
- Login page
- Change password page
- Protected routes
- JWT handling
- Role-based route guards

SUPER ADMIN UI
- Tenant management
- Subscription plan management
- Tenant onboarding form
- Tenant list
- Subscription assignment UI

ADMIN UI
- User management
- Appointment management
- Walk-in queue
- Patient management

DOCTOR UI
- My appointments
- Queue view
- Patient consultation flow

STAFF UI
- Appointment booking
- Walk-in registration
- Queue management

==================================================
FRONTEND TECH REQUIREMENTS
==================================================

Use:
- Next.js App Router
- TypeScript
- Tailwind CSS
- React Query
- Axios
- Zod validation
- Centralized API client
- Role-based rendering
- Reusable components

==================================================
UI REQUIREMENTS
==================================================

Use:
- Enterprise EMR dashboard design
- Responsive layout
- Accessible forms
- Role-based sidebar/menu
- Status badges
- Queue-style walk-in UI
- Confirmation modals
- Error states
- Loading states
- Empty states

==================================================
API REQUIREMENTS
==================================================

Generate APIs for:

AUTH
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/change-password

SUPER ADMIN
POST /api/super-admin/tenants
GET /api/super-admin/tenants
POST /api/super-admin/subscription-plans
PUT /api/super-admin/subscription-plans/{id}
GET /api/super-admin/subscription-plans

USERS
POST /api/users
GET /api/users
PUT /api/users/{id}

APPOINTMENTS
POST /api/appointments
PUT /api/appointments/{id}
PATCH /api/appointments/{id}/cancel
PATCH /api/appointments/{id}/complete
PATCH /api/appointments/{id}/start
GET /api/appointments
GET /api/appointments/{id}

==================================================
OUTPUT FORMAT
==================================================

Generate output in this order:

1. Folder/file structure
2. Backend implementation
3. Frontend implementation
4. Security implementation
5. Authentication flow
6. Tenant onboarding flow
7. API contracts
8. Sample request/response payloads
9. Authorization matrix
10. Validation rules
11. Suggested improvements
12. Future microservice extraction strategy

==================================================
IMPORTANT IMPLEMENTATION NOTES
==================================================

Generate:
- production-quality code
- enterprise-grade security
- reusable services
- reusable frontend components
- constructor injection
- DTO pattern
- mapper pattern
- modular monolith friendly implementation
- scalable codebase
- clean architecture principles

Avoid:
- pseudo code
- simplified authentication
- toy examples
- insecure implementations
- hardcoded credentials
```
