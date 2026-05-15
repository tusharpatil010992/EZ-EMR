package com.emr.modules.patient.dto;

import java.time.LocalDate;
import java.util.UUID;

public record PatientDto(
    UUID id,
    String fullName,
    String phone,
    LocalDate dateOfBirth,
    boolean isWalkin
) {}
