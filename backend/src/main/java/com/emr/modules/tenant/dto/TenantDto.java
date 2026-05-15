package com.emr.modules.tenant.dto;

import com.emr.modules.tenant.entity.TenantStatus;

import java.util.UUID;

public record TenantDto(
    UUID id,
    String name,
    TenantStatus status,
    UUID subscriptionPlanId
) {}
