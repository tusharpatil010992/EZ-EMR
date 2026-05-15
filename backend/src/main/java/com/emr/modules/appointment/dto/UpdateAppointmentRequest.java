package com.emr.modules.appointment.dto;

import java.time.Instant;
import java.util.UUID;

public record UpdateAppointmentRequest(
    Instant appointmentTime,
    UUID doctorId,
    String notes
) {}
