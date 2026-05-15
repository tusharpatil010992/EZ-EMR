package com.emr.modules.superadmin.controller;

import com.emr.modules.subscription.dto.CreateSubscriptionPlanRequest;
import com.emr.modules.subscription.dto.SubscriptionPlanDto;
import com.emr.modules.subscription.service.SubscriptionPlanService;
import com.emr.modules.superadmin.TenantOnboardingResponse;
import com.emr.modules.superadmin.TenantOnboardingService;
import com.emr.modules.tenant.dto.CreateTenantRequest;
import com.emr.modules.tenant.dto.TenantDto;
import com.emr.modules.tenant.service.TenantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/super-admin")
@PreAuthorize("hasRole('SUPER_ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Super Admin")
public class SuperAdminController {

    private final TenantOnboardingService onboardingService;
    private final TenantService tenantService;
    private final SubscriptionPlanService planService;

    // ── Tenant management ────────────────────────────────────────────────────

    @PostMapping("/tenants")
    @Operation(summary = "Onboard a new tenant (creates tenant + ADMIN user)")
    public ResponseEntity<TenantOnboardingResponse> onboardTenant(
            @Valid @RequestBody CreateTenantRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(onboardingService.onboardTenant(request));
    }

    @GetMapping("/tenants")
    @Operation(summary = "List all tenants")
    public ResponseEntity<List<TenantDto>> listTenants() {
        return ResponseEntity.ok(tenantService.listTenants());
    }

    @GetMapping("/tenants/{id}")
    @Operation(summary = "Get tenant by id")
    public ResponseEntity<TenantDto> getTenant(@PathVariable UUID id) {
        return ResponseEntity.ok(tenantService.getTenant(id));
    }

    @PatchMapping("/tenants/{id}/activate")
    @Operation(summary = "Activate a tenant")
    public ResponseEntity<TenantDto> activateTenant(@PathVariable UUID id) {
        return ResponseEntity.ok(tenantService.activateTenant(id));
    }

    @PatchMapping("/tenants/{id}/deactivate")
    @Operation(summary = "Deactivate a tenant")
    public ResponseEntity<TenantDto> deactivateTenant(@PathVariable UUID id) {
        return ResponseEntity.ok(tenantService.deactivateTenant(id));
    }

    // ── Subscription plan management ─────────────────────────────────────────

    @PostMapping("/subscription-plans")
    @Operation(summary = "Create subscription plan")
    public ResponseEntity<SubscriptionPlanDto> createPlan(
            @Valid @RequestBody CreateSubscriptionPlanRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(planService.createPlan(request));
    }

    @PutMapping("/subscription-plans/{id}")
    @Operation(summary = "Update subscription plan")
    public ResponseEntity<SubscriptionPlanDto> updatePlan(
            @PathVariable UUID id,
            @Valid @RequestBody CreateSubscriptionPlanRequest request) {
        return ResponseEntity.ok(planService.updatePlan(id, request));
    }

    @PatchMapping("/subscription-plans/{id}/toggle")
    @Operation(summary = "Enable or disable subscription plan")
    public ResponseEntity<SubscriptionPlanDto> togglePlan(@PathVariable UUID id) {
        return ResponseEntity.ok(planService.toggleActive(id));
    }

    @GetMapping("/subscription-plans")
    @Operation(summary = "List all subscription plans")
    public ResponseEntity<List<SubscriptionPlanDto>> listPlans() {
        return ResponseEntity.ok(planService.listPlans());
    }
}
