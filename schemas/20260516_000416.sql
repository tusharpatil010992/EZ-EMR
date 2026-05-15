-- ============================================================
-- EZ-EMR Full Schema — Consolidated
-- Generated: 2026-05-16
-- Source: V1__init_schema.sql + V2__add_tenants_users_plans.sql
--         + V3__alter_appointments_patients.sql
-- ============================================================

-- Enable UUID generation
-- (PostgreSQL 13+: gen_random_uuid() is built-in via pgcrypto)


-- ============================================================
-- SUBSCRIPTION PLANS
-- Must be created before tenants (FK dependency)
-- ============================================================

CREATE TABLE subscription_plans (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(100)    NOT NULL,
    billing_cycle       VARCHAR(10)     NOT NULL,   -- MONTHLY | YEARLY
    price               NUMERIC(10,2)   NOT NULL DEFAULT 0,
    max_doctors         INT             NOT NULL DEFAULT 5,
    active              BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP       NOT NULL DEFAULT NOW()
);


-- ============================================================
-- TENANTS
-- ============================================================

CREATE TABLE tenants (
    id                      UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name                    VARCHAR(255)    NOT NULL,
    status                  VARCHAR(20)     NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE | INACTIVE
    subscription_plan_id    UUID            REFERENCES subscription_plans(id),
    created_at              TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP       NOT NULL DEFAULT NOW()
);


-- ============================================================
-- USERS
-- tenant_id is NULL for SUPER_ADMIN only
-- ============================================================

CREATE TABLE users (
    id                                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id                           UUID            REFERENCES tenants(id),
    email                               VARCHAR(255)    NOT NULL UNIQUE,
    password_hash                       VARCHAR(255)    NOT NULL,
    full_name                           VARCHAR(255)    NOT NULL,
    role                                VARCHAR(20)     NOT NULL,   -- SUPER_ADMIN | ADMIN | DOCTOR | STAFF
    active                              BOOLEAN         NOT NULL DEFAULT TRUE,
    first_login_password_reset_required BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at                          TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at                          TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email  ON users(email);
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_role   ON users(role);


-- ============================================================
-- PATIENTS
-- ============================================================

CREATE TABLE patients (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID            NOT NULL REFERENCES tenants(id),
    full_name       VARCHAR(255)    NOT NULL,
    phone           VARCHAR(20),
    email           VARCHAR(255),
    gender          VARCHAR(10),                -- MALE | FEMALE | OTHER
    date_of_birth   DATE,
    is_walkin       BOOLEAN         NOT NULL DEFAULT FALSE,
    deleted_at      TIMESTAMP,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_patients_tenant ON patients(tenant_id);


-- ============================================================
-- APPOINTMENTS
-- appointment_time is NULL for walk-in patients
-- ============================================================

CREATE TABLE appointments (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID            NOT NULL REFERENCES tenants(id),
    patient_id          UUID            NOT NULL REFERENCES patients(id),
    doctor_id           UUID            REFERENCES users(id),
    appointment_time    TIMESTAMP,                  -- NULL for walk-ins
    is_walkin           BOOLEAN         NOT NULL DEFAULT FALSE,
    status              VARCHAR(20)     NOT NULL DEFAULT 'SCHEDULED',
                                                    -- SCHEDULED | IN_PROGRESS | COMPLETED | CANCELLED
    notes               TEXT,
    cancel_reason       VARCHAR(500),
    deleted_at          TIMESTAMP,
    created_at          TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_appointments_tenant  ON appointments(tenant_id);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor  ON appointments(doctor_id);
CREATE INDEX idx_appointments_status  ON appointments(status);
CREATE INDEX idx_appointments_time    ON appointments(appointment_time);


-- ============================================================
-- SUBSCRIPTIONS
-- One active subscription per tenant (UNIQUE on tenant_id)
-- ============================================================

CREATE TABLE subscriptions (
    id                      UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id               UUID            NOT NULL UNIQUE REFERENCES tenants(id),
    subscription_plan_id    UUID            REFERENCES subscription_plans(id),
    plan_name               VARCHAR(100)    NOT NULL,
    billing_cycle           VARCHAR(10),
    renewal_date            DATE            NOT NULL,
    start_date              DATE,
    seats                   INT             NOT NULL DEFAULT 1,
    status                  VARCHAR(20)     NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE | INACTIVE | EXPIRED
    deleted_at              TIMESTAMP,
    created_at              TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP       NOT NULL DEFAULT NOW()
);


-- ============================================================
-- USEFUL QUERIES
-- ============================================================

-- Active tenants with their subscription plan
SELECT t.id, t.name, t.status, sp.name AS plan_name, sp.billing_cycle, sp.price
FROM tenants t
LEFT JOIN subscription_plans sp ON sp.id = t.subscription_plan_id
WHERE t.status = 'ACTIVE'
ORDER BY t.created_at DESC;

-- Users by tenant (exclude SUPER_ADMIN)
SELECT id, full_name, email, role, active, first_login_password_reset_required
FROM users
WHERE tenant_id = :tenantId
ORDER BY role, full_name;

-- Scheduled appointments for a doctor on a given date
SELECT a.id, p.full_name AS patient_name, a.appointment_time, a.status, a.is_walkin
FROM appointments a
JOIN patients p ON p.id = a.patient_id
WHERE a.doctor_id = :doctorId
  AND DATE(a.appointment_time) = :date
  AND a.status NOT IN ('CANCELLED')
  AND a.deleted_at IS NULL
ORDER BY a.appointment_time;

-- Walk-in queue for a tenant (unattended, not completed/cancelled)
SELECT a.id, p.full_name AS patient_name, a.status, a.created_at, u.full_name AS doctor_name
FROM appointments a
JOIN patients p ON p.id = a.patient_id
LEFT JOIN users u ON u.id = a.doctor_id
WHERE a.tenant_id = :tenantId
  AND a.is_walkin = TRUE
  AND a.status NOT IN ('COMPLETED', 'CANCELLED')
  AND a.deleted_at IS NULL
ORDER BY a.created_at;

-- Overlap detection: appointments within 30 min for same doctor
SELECT id FROM appointments
WHERE doctor_id = :doctorId
  AND status != 'CANCELLED'
  AND deleted_at IS NULL
  AND appointment_time BETWEEN (:proposedTime - INTERVAL '30 minutes')
                           AND (:proposedTime + INTERVAL '30 minutes')
  AND (:excludeId IS NULL OR id != :excludeId);

-- Paginated patient list for a tenant (excluding soft-deleted)
SELECT id, full_name, phone, email, gender, date_of_birth, is_walkin, created_at
FROM patients
WHERE tenant_id = :tenantId
  AND deleted_at IS NULL
ORDER BY full_name
LIMIT :pageSize OFFSET :offset;

-- Current subscription for a tenant
SELECT s.id, s.plan_name, s.renewal_date, s.seats, s.status,
       sp.billing_cycle, sp.price, sp.max_doctors
FROM subscriptions s
LEFT JOIN subscription_plans sp ON sp.id = s.subscription_plan_id
WHERE s.tenant_id = :tenantId
  AND s.deleted_at IS NULL;

-- Active doctors for a tenant (for appointment booking dropdown)
SELECT id, full_name, email
FROM users
WHERE tenant_id = :tenantId
  AND role = 'DOCTOR'
  AND active = TRUE
ORDER BY full_name;

-- Appointment counts by status for a tenant (dashboard summary)
SELECT status, COUNT(*) AS total
FROM appointments
WHERE tenant_id = :tenantId
  AND deleted_at IS NULL
GROUP BY status;
