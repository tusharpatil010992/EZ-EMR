package com.emr.modules.appointment.dto;

import com.emr.modules.appointment.entity.AppointmentStatus;

import java.time.Instant;
import java.util.UUID;

public record AppointmentDto(
    UUID id,
    UUID tenantId,
    UUID patientId,
    UUID doctorId,
    Instant appointmentTime,
    boolean isWalkin,
    AppointmentStatus status,
    String notes,
    String cancelReason,
    Instant createdAt
) {}
