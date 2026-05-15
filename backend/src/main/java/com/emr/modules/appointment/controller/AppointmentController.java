package com.emr.modules.appointment.controller;

import com.emr.modules.appointment.dto.*;
import com.emr.modules.appointment.service.AppointmentService;
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

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
@Tag(name = "Appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'SUPER_ADMIN')")
    @Operation(summary = "Create appointment or register walk-in")
    public ResponseEntity<AppointmentDto> create(@Valid @RequestBody CreateAppointmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.createAppointment(request));
    }

    @GetMapping
    @Operation(summary = "List appointments (role-filtered)")
    public ResponseEntity<Page<AppointmentDto>> list(
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(appointmentService.listAppointments(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get appointment by id")
    public ResponseEntity<AppointmentDto> get(@PathVariable UUID id) {
        return ResponseEntity.ok(appointmentService.getAppointment(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'SUPER_ADMIN')")
    @Operation(summary = "Update appointment")
    public ResponseEntity<AppointmentDto> update(@PathVariable UUID id,
                                                  @Valid @RequestBody UpdateAppointmentRequest request) {
        return ResponseEntity.ok(appointmentService.updateAppointment(id, request));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'SUPER_ADMIN')")
    @Operation(summary = "Cancel appointment")
    public ResponseEntity<Void> cancel(@PathVariable UUID id,
                                       @RequestBody(required = false) CancelAppointmentRequest request) {
        appointmentService.cancelAppointment(id, request != null ? request.reason() : null);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/start")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'SUPER_ADMIN')")
    @Operation(summary = "Start appointment (SCHEDULED → IN_PROGRESS)")
    public ResponseEntity<AppointmentDto> start(@PathVariable UUID id) {
        return ResponseEntity.ok(appointmentService.startAppointment(id));
    }

    @PatchMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('DOCTOR', 'SUPER_ADMIN')")
    @Operation(summary = "Complete appointment (IN_PROGRESS → COMPLETED)")
    public ResponseEntity<AppointmentDto> complete(@PathVariable UUID id) {
        return ResponseEntity.ok(appointmentService.completeAppointment(id));
    }

    @GetMapping("/walk-in-queue")
    @Operation(summary = "Get walk-in queue for current tenant / doctor")
    public ResponseEntity<List<AppointmentDto>> walkInQueue() {
        return ResponseEntity.ok(appointmentService.getWalkInQueue());
    }
}
