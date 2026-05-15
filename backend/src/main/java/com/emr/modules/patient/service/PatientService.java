package com.emr.modules.patient.service;

import com.emr.modules.patient.dto.PatientDto;
import com.emr.modules.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    public List<PatientDto> getAllPatients(UUID tenantId) {
        return patientRepository.findAllByTenantId(tenantId).stream()
                .map(p -> new PatientDto(p.getId(), p.getFullName(), p.getPhone(), p.getDateOfBirth(), p.isWalkin()))
                .toList();
    }
}
