package com.emr.modules.appointment.repository;

import com.emr.modules.appointment.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    List<Appointment> findAllByTenantId(UUID tenantId);
}
