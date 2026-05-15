package com.emr.modules.appointment.service;

import com.emr.modules.appointment.dto.AppointmentDto;
import com.emr.modules.appointment.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public List<AppointmentDto> getAllAppointments(UUID tenantId) {
        return appointmentRepository.findAllByTenantId(tenantId).stream()
                .map(a -> new AppointmentDto(a.getId(), a.getPatientId(), a.getAppointmentTime(), a.isWalkin(), a.getStatus()))
                .toList();
    }
}
