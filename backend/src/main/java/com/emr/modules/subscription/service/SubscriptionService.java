package com.emr.modules.subscription.service;

import com.emr.modules.subscription.dto.SubscriptionDto;
import com.emr.modules.subscription.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;

    public Optional<SubscriptionDto> getByTenantId(UUID tenantId) {
        return subscriptionRepository.findByTenantId(tenantId)
                .map(s -> new SubscriptionDto(s.getId(), s.getTenantId(), s.getPlanName(), s.getRenewalDate(), s.getSeats(), s.getStatus()));
    }
}
