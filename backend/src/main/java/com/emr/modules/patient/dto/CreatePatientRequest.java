package com.emr.modules.patient.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record CreatePatientRequest(
    @NotBlank String fullName,
    String phone,
    String email,
    String gender,
    LocalDate dateOfBirth,
    boolean isWalkin
) {}
