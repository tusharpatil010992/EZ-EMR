-- Extend appointments table
ALTER TABLE appointments ADD COLUMN doctor_id UUID REFERENCES users(id);
ALTER TABLE appointments ADD COLUMN notes TEXT;
ALTER TABLE appointments ADD COLUMN cancel_reason VARCHAR(500);
ALTER TABLE appointments ADD COLUMN deleted_at TIMESTAMP;

-- Extend patients table
ALTER TABLE patients ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE patients ADD COLUMN email VARCHAR(255);
ALTER TABLE patients ADD COLUMN gender VARCHAR(10);

-- Extend subscriptions table
ALTER TABLE subscriptions ADD COLUMN subscription_plan_id UUID REFERENCES subscription_plans(id);
ALTER TABLE subscriptions ADD COLUMN start_date DATE;
ALTER TABLE subscriptions ADD COLUMN deleted_at TIMESTAMP;

-- Additional indexes
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_time ON appointments(appointment_time);
