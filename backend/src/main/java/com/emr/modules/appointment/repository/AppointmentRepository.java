package com.emr.modules.appointment.repository;

import com.emr.modules.appointment.entity.Appointment;
import com.emr.modules.appointment.entity.AppointmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    List<Appointment> findAllByTenantId(UUID tenantId);

    Page<Appointment> findAllByTenantIdAndDeletedAtIsNull(UUID tenantId, Pageable pageable);

    Page<Appointment> findAllByTenantIdAndDoctorIdAndDeletedAtIsNull(UUID tenantId, UUID doctorId, Pageable pageable);

    List<Appointment> findAllByTenantIdAndIsWalkinTrueAndDeletedAtIsNullAndStatusNot(
        UUID tenantId, AppointmentStatus status);

    List<Appointment> findAllByTenantIdAndDoctorIdAndIsWalkinTrueAndDeletedAtIsNullAndStatusNot(
        UUID tenantId, UUID doctorId, AppointmentStatus status);

    @Query("SELECT COUNT(a) > 0 FROM Appointment a WHERE a.doctorId = :doctorId " +
           "AND a.appointmentTime BETWEEN :start AND :end " +
           "AND a.status != 'CANCELLED' AND a.deletedAt IS NULL AND a.id != :excludeId")
    boolean existsOverlap(@Param("doctorId") UUID doctorId,
                          @Param("start") Instant start,
                          @Param("end") Instant end,
                          @Param("excludeId") UUID excludeId);
}
