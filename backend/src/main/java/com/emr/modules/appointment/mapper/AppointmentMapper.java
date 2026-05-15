package com.emr.modules.appointment.mapper;

import com.emr.modules.appointment.dto.AppointmentDto;
import com.emr.modules.appointment.entity.Appointment;
import org.springframework.stereotype.Component;

@Component
public class AppointmentMapper {

    public AppointmentDto toDto(Appointment a) {
        return new AppointmentDto(
            a.getId(),
            a.getTenantId(),
            a.getPatientId(),
            a.getDoctorId(),
            a.getAppointmentTime(),
            a.isWalkin(),
            a.getStatus(),
            a.getNotes(),
            a.getCancelReason(),
            a.getCreatedAt()
        );
    }
}
