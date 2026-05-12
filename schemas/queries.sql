-- =========================================================
-- EMR MVP DATABASE SCHEMA (SIMPLE + WALK-IN SUPPORT)
-- Modules:
-- 1. Subscription Management
-- 2. Appointment Scheduling
-- =========================================================

-- =========================================================
-- 1. TENANTS (CLINICS / HOSPITALS)
-- =========================================================
CREATE TABLE tenants (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- 2. USERS (DOCTORS / STAFF)
-- =========================================================
CREATE TABLE users (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(20), -- ✅ USED FOR OTP LOGIN (FUTURE)
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- ADMIN, DOCTOR, STAFF
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_users_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- =========================================================
-- 3. SUBSCRIPTION PLANS
-- =========================================================
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    billing_cycle VARCHAR(20), -- MONTHLY, YEARLY
    max_users INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- 4. SUBSCRIPTIONS
-- =========================================================
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    plan_id UUID NOT NULL,
    status VARCHAR(50), -- ACTIVE, EXPIRED, CANCELLED
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_subscription_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id),

    CONSTRAINT fk_subscription_plan
        FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

-- =========================================================
-- 5. PATIENTS (INCLUDING WALK-IN SUPPORT)
-- =========================================================
CREATE TABLE patients (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,

    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),

    is_walkin BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_patient_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- =========================================================
-- 6. APPOINTMENTS (INCLUDING WALK-IN VISITS)
-- =========================================================
CREATE TABLE appointments (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,

    patient_id UUID NOT NULL,
    doctor_id UUID NOT NULL,

    appointment_time TIMESTAMP, 
    -- NULL allowed for walk-in patients (no prior booking)

    is_walkin BOOLEAN DEFAULT FALSE,

    status VARCHAR(50), 
    -- SCHEDULED, COMPLETED, CANCELLED, IN_PROGRESS

    notes TEXT,

    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_appt_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id),

    CONSTRAINT fk_appt_patient
        FOREIGN KEY (patient_id) REFERENCES patients(id),

    CONSTRAINT fk_appt_doctor
        FOREIGN KEY (doctor_id) REFERENCES users(id)
);