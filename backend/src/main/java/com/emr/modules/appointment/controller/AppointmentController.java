package com.emr.modules.appointment.controller;

import com.emr.modules.appointment.dto.AppointmentDto;
import com.emr.modules.appointment.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping
    public ResponseEntity<List<AppointmentDto>> list(@RequestParam UUID tenantId) {
        return ResponseEntity.ok(appointmentService.getAllAppointments(tenantId));
    }
}
