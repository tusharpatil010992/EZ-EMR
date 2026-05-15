package com.emr.modules.subscription.service;

import com.emr.modules.subscription.dto.CreateSubscriptionPlanRequest;
import com.emr.modules.subscription.dto.SubscriptionPlanDto;
import com.emr.modules.subscription.entity.SubscriptionPlan;

import java.util.List;
import java.util.UUID;

public interface SubscriptionPlanService {
    SubscriptionPlanDto createPlan(CreateSubscriptionPlanRequest request);
    SubscriptionPlanDto updatePlan(UUID id, CreateSubscriptionPlanRequest request);
    SubscriptionPlanDto toggleActive(UUID id);
    List<SubscriptionPlanDto> listPlans();
    SubscriptionPlan getPlanEntity(UUID id);
}
