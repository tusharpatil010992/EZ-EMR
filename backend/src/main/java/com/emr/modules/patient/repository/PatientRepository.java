package com.emr.modules.patient.repository;

import com.emr.modules.patient.entity.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PatientRepository extends JpaRepository<Patient, UUID> {
    List<Patient> findAllByTenantId(UUID tenantId);
    Page<Patient> findAllByTenantIdAndDeletedAtIsNull(UUID tenantId, Pageable pageable);
    Page<Patient> findAllByTenantIdAndIsWalkinAndDeletedAtIsNull(UUID tenantId, boolean isWalkin, Pageable pageable);
}
