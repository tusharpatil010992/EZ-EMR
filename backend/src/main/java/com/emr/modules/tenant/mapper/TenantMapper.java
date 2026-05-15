package com.emr.modules.tenant.mapper;

import com.emr.modules.tenant.dto.TenantDto;
import com.emr.modules.tenant.entity.Tenant;
import org.springframework.stereotype.Component;

@Component
public class TenantMapper {

    public TenantDto toDto(Tenant tenant) {
        return new TenantDto(
            tenant.getId(),
            tenant.getName(),
            tenant.getStatus(),
            tenant.getSubscriptionPlanId()
        );
    }
}
