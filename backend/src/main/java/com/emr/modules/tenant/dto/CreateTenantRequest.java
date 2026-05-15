package com.emr.modules.tenant.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreateTenantRequest(
    @NotBlank String tenantName,
    @NotNull UUID subscriptionPlanId,
    @NotBlank @Email String adminEmail,
    @NotBlank String adminFullName
) {}
