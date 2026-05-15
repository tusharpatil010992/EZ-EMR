package com.emr.modules.tenant.service;

import com.emr.modules.tenant.dto.TenantDto;
import com.emr.modules.tenant.entity.Tenant;
import com.emr.modules.tenant.entity.TenantStatus;
import com.emr.modules.tenant.mapper.TenantMapper;
import com.emr.modules.tenant.repository.TenantRepository;
import com.emr.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TenantServiceImpl implements TenantService {

    private final TenantRepository tenantRepository;
    private final TenantMapper tenantMapper;

    @Override
    @Transactional
    public Tenant createTenant(String name, UUID subscriptionPlanId) {
        Tenant tenant = Tenant.builder()
                .name(name)
                .status(TenantStatus.ACTIVE)
                .subscriptionPlanId(subscriptionPlanId)
                .build();
        return tenantRepository.save(tenant);
    }

    @Override
    public List<TenantDto> listTenants() {
        return tenantRepository.findAll().stream()
                .map(tenantMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public TenantDto getTenant(UUID id) {
        return tenantRepository.findById(id)
                .map(tenantMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found: " + id));
    }

    @Override
    @Transactional
    public TenantDto activateTenant(UUID id) {
        Tenant tenant = findOrThrow(id);
        tenant.setStatus(TenantStatus.ACTIVE);
        return tenantMapper.toDto(tenantRepository.save(tenant));
    }

    @Override
    @Transactional
    public TenantDto deactivateTenant(UUID id) {
        Tenant tenant = findOrThrow(id);
        tenant.setStatus(TenantStatus.INACTIVE);
        return tenantMapper.toDto(tenantRepository.save(tenant));
    }

    private Tenant findOrThrow(UUID id) {
        return tenantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found: " + id));
    }
}
