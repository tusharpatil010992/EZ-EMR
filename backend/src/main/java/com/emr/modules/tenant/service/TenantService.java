package com.emr.modules.tenant.service;

import com.emr.modules.tenant.dto.TenantDto;
import com.emr.modules.tenant.entity.Tenant;

import java.util.List;
import java.util.UUID;

public interface TenantService {
    Tenant createTenant(String name, UUID subscriptionPlanId);
    List<TenantDto> listTenants();
    TenantDto getTenant(UUID id);
    TenantDto activateTenant(UUID id);
    TenantDto deactivateTenant(UUID id);
}
