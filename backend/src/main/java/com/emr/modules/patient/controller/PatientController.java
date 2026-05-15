package com.emr.modules.patient.controller;

import com.emr.modules.patient.dto.PatientDto;
import com.emr.modules.patient.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping
    public ResponseEntity<List<PatientDto>> list(@RequestParam UUID tenantId) {
        return ResponseEntity.ok(patientService.getAllPatients(tenantId));
    }
}
