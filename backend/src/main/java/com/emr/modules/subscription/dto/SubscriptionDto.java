package com.emr.modules.subscription.dto;

import com.emr.modules.subscription.entity.SubscriptionStatus;
import java.time.LocalDate;
import java.util.UUID;

public record SubscriptionDto(
    UUID id,
    UUID tenantId,
    String planName,
    LocalDate renewalDate,
    int seats,
    SubscriptionStatus status
) {}
