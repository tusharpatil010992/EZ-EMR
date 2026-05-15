package com.emr.modules.appointment.dto;

import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.UUID;

public record CreateAppointmentRequest(
    @NotNull UUID patientId,
    UUID doctorId,
    Instant appointmentTime,
    boolean isWalkin,
    String notes
) {}
