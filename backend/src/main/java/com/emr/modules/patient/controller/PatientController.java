package com.emr.modules.patient.controller;

import com.emr.modules.patient.dto.CreatePatientRequest;
import com.emr.modules.patient.dto.PatientDto;
import com.emr.modules.patient.service.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
@Tag(name = "Patients")
public class PatientController {

    private final PatientService patientService;

    @GetMapping
    @Operation(summary = "List patients (tenant-scoped, paginated)")
    public ResponseEntity<Page<PatientDto>> list(
            @RequestParam(required = false) Boolean walkin,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(patientService.listPatients(walkin, pageable));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'SUPER_ADMIN')")
    @Operation(summary = "Register a new patient")
    public ResponseEntity<PatientDto> create(@Valid @RequestBody CreatePatientRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(patientService.createPatient(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'SUPER_ADMIN')")
    @Operation(summary = "Update patient")
    public ResponseEntity<PatientDto> update(@PathVariable UUID id,
                                             @Valid @RequestBody CreatePatientRequest request) {
        return ResponseEntity.ok(patientService.updatePatient(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Soft-delete patient")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }
}
