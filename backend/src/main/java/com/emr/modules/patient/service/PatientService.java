package com.emr.modules.patient.service;

import com.emr.modules.patient.dto.CreatePatientRequest;
import com.emr.modules.patient.dto.PatientDto;
import com.emr.modules.patient.entity.Patient;
import com.emr.modules.patient.repository.PatientRepository;
import com.emr.shared.exception.ResourceNotFoundException;
import com.emr.shared.security.AuthenticatedUserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final AuthenticatedUserContext userContext;

    public Page<PatientDto> listPatients(Boolean walkin, Pageable pageable) {
        UUID tenantId = userContext.getCurrentTenantId();
        if (walkin != null) {
            return patientRepository
                .findAllByTenantIdAndIsWalkinAndDeletedAtIsNull(tenantId, walkin, pageable)
                .map(this::toDto);
        }
        return patientRepository
            .findAllByTenantIdAndDeletedAtIsNull(tenantId, pageable)
            .map(this::toDto);
    }

    @Transactional
    public PatientDto createPatient(CreatePatientRequest request) {
        UUID tenantId = userContext.getCurrentTenantId();
        Patient patient = Patient.builder()
                .tenantId(tenantId)
                .fullName(request.fullName())
                .phone(request.phone())
                .email(request.email())
                .gender(request.gender())
                .dateOfBirth(request.dateOfBirth())
                .isWalkin(request.isWalkin())
                .build();
        return toDto(patientRepository.save(patient));
    }

    @Transactional
    public PatientDto updatePatient(UUID id, CreatePatientRequest request) {
        Patient patient = findInTenant(id);
        patient.setFullName(request.fullName());
        patient.setPhone(request.phone());
        patient.setEmail(request.email());
        patient.setGender(request.gender());
        patient.setDateOfBirth(request.dateOfBirth());
        patient.setWalkin(request.isWalkin());
        return toDto(patientRepository.save(patient));
    }

    @Transactional
    public void deletePatient(UUID id) {
        Patient patient = findInTenant(id);
        patient.setDeletedAt(Instant.now());
        patientRepository.save(patient);
    }

    private Patient findInTenant(UUID id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + id));
        if (!patient.getTenantId().equals(userContext.getCurrentTenantId())
            && !userContext.isSuperAdmin()) {
            throw new ResourceNotFoundException("Patient not found: " + id);
        }
        return patient;
    }

    private PatientDto toDto(Patient p) {
        return new PatientDto(p.getId(), p.getTenantId(), p.getFullName(), p.getPhone(),
            p.getEmail(), p.getGender(), p.getDateOfBirth(), p.isWalkin());
    }

    // Kept for backwards compatibility with older callers
    public java.util.List<PatientDto> getAllPatients(UUID tenantId) {
        return patientRepository.findAllByTenantId(tenantId).stream()
                .filter(p -> p.getDeletedAt() == null)
                .map(this::toDto)
                .toList();
    }
}
