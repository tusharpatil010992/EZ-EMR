package com.emr.modules.superadmin;

import com.emr.modules.subscription.entity.SubscriptionPlan;
import com.emr.modules.subscription.service.SubscriptionPlanService;
import com.emr.modules.tenant.dto.CreateTenantRequest;
import com.emr.modules.tenant.entity.Tenant;
import com.emr.modules.tenant.service.TenantService;
import com.emr.modules.user.dto.CreateUserRequest;
import com.emr.modules.user.dto.CreateUserResponse;
import com.emr.modules.user.entity.Role;
import com.emr.modules.user.service.UserService;
import com.emr.shared.exception.BusinessRuleException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TenantOnboardingService {

    private final TenantService tenantService;
    private final UserService userService;
    private final SubscriptionPlanService subscriptionPlanService;

    @Transactional
    public TenantOnboardingResponse onboardTenant(CreateTenantRequest request) {
        SubscriptionPlan plan = subscriptionPlanService.getPlanEntity(request.subscriptionPlanId());
        if (!plan.isActive()) {
            throw new BusinessRuleException("Subscription plan is not active");
        }

        Tenant tenant = tenantService.createTenant(request.tenantName(), request.subscriptionPlanId());

        CreateUserRequest adminRequest = new CreateUserRequest(
            request.adminEmail(),
            request.adminFullName(),
            Role.ADMIN
        );
        CreateUserResponse adminUser = userService.createUser(adminRequest, tenant.getId());

        return new TenantOnboardingResponse(
            tenant.getId(),
            tenant.getName(),
            adminUser.email(),
            adminUser.generatedPassword()
        );
    }
}
