package com.emr.modules.appointment.dto;

import com.emr.modules.appointment.entity.AppointmentStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public record AppointmentDto(
    UUID id,
    UUID patientId,
    LocalDateTime appointmentTime,
    boolean isWalkin,
    AppointmentStatus status
) {}
