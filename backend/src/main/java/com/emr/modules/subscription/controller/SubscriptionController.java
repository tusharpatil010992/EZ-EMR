package com.emr.modules.subscription.controller;

import com.emr.modules.subscription.dto.SubscriptionDto;
import com.emr.modules.subscription.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<SubscriptionDto> getByTenant(@PathVariable UUID tenantId) {
        return subscriptionService.getByTenantId(tenantId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
