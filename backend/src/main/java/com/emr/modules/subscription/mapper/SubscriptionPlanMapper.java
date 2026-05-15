package com.emr.modules.subscription.mapper;

import com.emr.modules.subscription.dto.SubscriptionPlanDto;
import com.emr.modules.subscription.entity.SubscriptionPlan;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionPlanMapper {

    public SubscriptionPlanDto toDto(SubscriptionPlan plan) {
        return new SubscriptionPlanDto(
            plan.getId(),
            plan.getName(),
            plan.getBillingCycle(),
            plan.getPrice(),
            plan.getMaxDoctors(),
            plan.isActive()
        );
    }
}
