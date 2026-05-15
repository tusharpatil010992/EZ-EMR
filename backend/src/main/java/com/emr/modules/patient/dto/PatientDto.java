package com.emr.modules.patient.dto;

import java.time.LocalDate;
import java.util.UUID;

public record PatientDto(
    UUID id,
    UUID tenantId,
    String fullName,
    String phone,
    String email,
    String gender,
    LocalDate dateOfBirth,
    boolean isWalkin
) {}
