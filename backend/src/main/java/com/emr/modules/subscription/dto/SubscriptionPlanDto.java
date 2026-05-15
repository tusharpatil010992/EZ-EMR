package com.emr.modules.subscription.dto;

import com.emr.modules.subscription.entity.BillingCycle;

import java.math.BigDecimal;
import java.util.UUID;

public record SubscriptionPlanDto(
    UUID id,
    String name,
    BillingCycle billingCycle,
    BigDecimal price,
    int maxDoctors,
    boolean active
) {}
