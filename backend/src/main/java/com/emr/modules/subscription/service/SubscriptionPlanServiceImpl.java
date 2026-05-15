package com.emr.modules.subscription.service;

import com.emr.modules.subscription.dto.CreateSubscriptionPlanRequest;
import com.emr.modules.subscription.dto.SubscriptionPlanDto;
import com.emr.modules.subscription.entity.SubscriptionPlan;
import com.emr.modules.subscription.mapper.SubscriptionPlanMapper;
import com.emr.modules.subscription.repository.SubscriptionPlanRepository;
import com.emr.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionPlanServiceImpl implements SubscriptionPlanService {

    private final SubscriptionPlanRepository planRepository;
    private final SubscriptionPlanMapper planMapper;

    @Override
    @Transactional
    public SubscriptionPlanDto createPlan(CreateSubscriptionPlanRequest request) {
        SubscriptionPlan plan = SubscriptionPlan.builder()
                .name(request.name())
                .billingCycle(request.billingCycle())
                .price(request.price())
                .maxDoctors(request.maxDoctors())
                .active(true)
                .build();
        return planMapper.toDto(planRepository.save(plan));
    }

    @Override
    @Transactional
    public SubscriptionPlanDto updatePlan(UUID id, CreateSubscriptionPlanRequest request) {
        SubscriptionPlan plan = findOrThrow(id);
        plan.setName(request.name());
        plan.setBillingCycle(request.billingCycle());
        plan.setPrice(request.price());
        plan.setMaxDoctors(request.maxDoctors());
        return planMapper.toDto(planRepository.save(plan));
    }

    @Override
    @Transactional
    public SubscriptionPlanDto toggleActive(UUID id) {
        SubscriptionPlan plan = findOrThrow(id);
        plan.setActive(!plan.isActive());
        return planMapper.toDto(planRepository.save(plan));
    }

    @Override
    public List<SubscriptionPlanDto> listPlans() {
        return planRepository.findAll().stream()
                .map(planMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public SubscriptionPlan getPlanEntity(UUID id) {
        return findOrThrow(id);
    }

    private SubscriptionPlan findOrThrow(UUID id) {
        return planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription plan not found: " + id));
    }
}
