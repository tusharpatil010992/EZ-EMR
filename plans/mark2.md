Generate a complete Appointment Module for the EMR SaaS platform.

Follow the existing project architecture, module conventions, coding standards, package structure, and folder organization already defined in the project markdown documentation.

# ACCESS CONTROL

The Appointment module must be accessible ONLY to:

- ADMIN
- STAFF
- DOCTOR

Implement proper role-based access control in both backend and frontend.

# ROLE RULES

ADMIN:
- Full access to all appointment operations of respective Tenant
- Can view all appointments within tenant
- Can assign/reassign doctor
- Can cancel appointments
- Can manage walk-ins

STAFF:
- Can create appointments
- Can update appointments
- Can manage walk-ins
- Can view appointment lists
- Can mark appointments as IN_PROGRESS
- Cannot access admin-only operations if any

DOCTOR:
- Can view only their own appointments
- Can mark appointments as COMPLETED
- Can mark appointments as IN_PROGRESS
- Can view walk-in queue assigned to them
- Cannot modify unrelated appointments

All APIs must enforce authorization checks.

Frontend UI must hide unauthorized actions based on role.

# MODULE REQUIREMENTS

Generate BOTH backend and frontend implementation for the Appointment module.

# APPOINTMENT FEATURES

The module must support:

1. Create appointment
2. Update appointment
3. Cancel appointment
4. Mark appointment as completed
5. Mark appointment as in progress
6. List appointments
7. Get appointment by ID
8. Filter appointments by:
   - date
   - doctor
   - patient
   - status
   - walk-in
9. Pagination support
10. Walk-in patient support

# WALK-IN REQUIREMENT

The system must support walk-in patients.

Rules:

- Walk-in appointments may not have a scheduled appointment_time initially
- appointment_time can be NULL for walk-ins
- is_walkin must indicate whether patient is walk-in
- Walk-in patients can later be assigned a consultation time
- Walk-ins should appear separately in queue/listing views
- Walk-ins must still belong to:
  - tenantId
  - patientId
  - doctorId

# APPOINTMENT TABLE

Use this schema exactly:

CREATE TABLE appointments (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,

    patient_id UUID NOT NULL,
    doctor_id UUID NOT NULL,

    appointment_time TIMESTAMP,

    is_walkin BOOLEAN DEFAULT FALSE,

    status VARCHAR(50),

    notes TEXT,

    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_appt_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id),

    CONSTRAINT fk_appt_patient
        FOREIGN KEY (patient_id) REFERENCES patients(id),

    CONSTRAINT fk_appt_doctor
        FOREIGN KEY (doctor_id) REFERENCES users(id)
);

# APPOINTMENT STATUS

Use enum:

- SCHEDULED
- IN_PROGRESS
- COMPLETED
- CANCELLED

# BACKEND REQUIREMENTS

Generate production-ready Spring Boot code for:

1. Entity
2. Enum
3. DTOs
4. Repository
5. Service interface
6. Service implementation
7. Mapper
8. REST controller
9. Validation
10. Global exception handling integration
11. Pagination support
12. Filtering support
13. Swagger/OpenAPI annotations
14. Soft cancellation logic
15. Tenant-aware queries
16. Audit fields handling
17. JPQL/specification filtering if needed
18. Spring Security role-based authorization
19. Method-level authorization using @PreAuthorize where appropriate

# BUSINESS RULES

1. All queries MUST be tenant-aware
2. Cancelled appointments cannot be modified
3. Walk-in appointments can have NULL appointment_time
4. Non-walk-in appointments require appointment_time
5. Prevent overlapping appointments for same doctor
6. Soft delete preferred over hard delete
7. Use UTC timestamps
8. Doctor availability validation required
9. Only ACTIVE appointments participate in overlap validation
10. Doctors can only access their own appointments
11. Staff and Admin can access all appointments within tenant

# REQUIRED API ENDPOINTS

POST   /api/appointments
PUT    /api/appointments/{id}
PATCH  /api/appointments/{id}/cancel
PATCH  /api/appointments/{id}/complete
PATCH  /api/appointments/{id}/start
GET    /api/appointments/{id}
GET    /api/appointments

Filters:
- doctorId
- patientId
- status
- isWalkin
- date

# FRONTEND REQUIREMENTS

Generate complete Next.js Appointment module including:

1. Appointment list page
2. Walk-in queue page
3. Appointment creation form
4. Appointment edit form
5. Appointment details page
6. Appointment filtering UI
7. Appointment status badges
8. Walk-in indicator UI
9. Queue management UI
10. Loading states
11. Error states
12. Empty states
13. React Query integration
14. Axios API layer
15. TypeScript interfaces
16. Zod validation
17. Tailwind UI components
18. Reusable form components
19. Modal confirmation for cancellation
20. Role-based UI rendering
21. Permission guards
22. Hidden/disabled unauthorized actions

# REQUIRED FRONTEND PAGES

/appointments
/appointments/new
/appointments/[id]
/appointments/[id]/edit
/appointments/walkins

# UI REQUIREMENTS

Use:
- Clean EMR dashboard design
- Responsive layout
- Accessible forms
- Status color badges
- Doctor-wise filtering
- Queue-style walk-in listing
- Empty state illustrations/messages
- Mobile-friendly tables/cards

# API CLIENT REQUIREMENTS

Use:
- Centralized Axios client
- JWT authorization header
- React Query hooks
- Typed API responses
- Proper error handling

# SECURITY REQUIREMENTS

Implement:
- JWT authentication integration
- Role-based authorization
- Tenant isolation
- Secure API access
- Route protection
- Frontend permission-based rendering
- Backend authorization validation

# OUTPUT FORMAT

Generate output in this order:

1. Folder/file structure
2. Backend implementation
3. Frontend implementation
4. API contracts
5. Sample request/response payloads
6. Validation rules
7. Authorization rules
8. Suggested enhancements
9. Future scalability improvements

IMPORTANT:
- Generate production-quality code
- Avoid pseudo code
- Use clean code principles
- Use constructor injection
- Use DTO pattern
- Use mapper classes
- Keep modules isolated
- Follow modular monolith principles