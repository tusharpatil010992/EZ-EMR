package com.emr.modules.superadmin;

import java.util.UUID;

public record TenantOnboardingResponse(
    UUID tenantId,
    String tenantName,
    String adminEmail,
    String generatedPassword
) {}
