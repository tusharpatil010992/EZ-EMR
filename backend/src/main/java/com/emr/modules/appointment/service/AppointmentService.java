package com.emr.modules.appointment.service;

import com.emr.modules.appointment.dto.*;
import com.emr.modules.appointment.entity.Appointment;
import com.emr.modules.appointment.entity.AppointmentStatus;
import com.emr.modules.appointment.mapper.AppointmentMapper;
import com.emr.modules.appointment.repository.AppointmentRepository;
import com.emr.modules.user.entity.Role;
import com.emr.shared.exception.BusinessRuleException;
import com.emr.shared.exception.ResourceNotFoundException;
import com.emr.shared.security.AuthenticatedUserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;
    private final AuthenticatedUserContext userContext;

    @Transactional
    public AppointmentDto createAppointment(CreateAppointmentRequest request) {
        UUID tenantId = userContext.getCurrentTenantId();

        if (!request.isWalkin() && request.appointmentTime() == null) {
            throw new BusinessRuleException("Appointment time is required for non-walk-in appointments");
        }

        if (request.doctorId() != null && request.appointmentTime() != null) {
            checkOverlap(request.doctorId(), request.appointmentTime(), null);
        }

        Appointment appt = Appointment.builder()
                .tenantId(tenantId)
                .patientId(request.patientId())
                .doctorId(request.doctorId())
                .appointmentTime(request.appointmentTime())
                .isWalkin(request.isWalkin())
                .notes(request.notes())
                .status(AppointmentStatus.SCHEDULED)
                .build();

        return appointmentMapper.toDto(appointmentRepository.save(appt));
    }

    @Transactional
    public AppointmentDto updateAppointment(UUID id, UpdateAppointmentRequest request) {
        Appointment appt = findAccessible(id);
        guardNotCancelled(appt);

        if (request.appointmentTime() != null && request.doctorId() != null) {
            checkOverlap(request.doctorId(), request.appointmentTime(), id);
        }

        if (request.appointmentTime() != null) appt.setAppointmentTime(request.appointmentTime());
        if (request.doctorId() != null) appt.setDoctorId(request.doctorId());
        if (request.notes() != null) appt.setNotes(request.notes());

        return appointmentMapper.toDto(appointmentRepository.save(appt));
    }

    @Transactional
    public void cancelAppointment(UUID id, String reason) {
        Appointment appt = findAccessible(id);
        guardNotCancelled(appt);
        appt.setStatus(AppointmentStatus.CANCELLED);
        appt.setCancelReason(reason);
        appointmentRepository.save(appt);
    }

    @Transactional
    public AppointmentDto startAppointment(UUID id) {
        Appointment appt = findAccessible(id);
        if (appt.getStatus() != AppointmentStatus.SCHEDULED) {
            throw new BusinessRuleException("Only SCHEDULED appointments can be started");
        }
        appt.setStatus(AppointmentStatus.IN_PROGRESS);
        return appointmentMapper.toDto(appointmentRepository.save(appt));
    }

    @Transactional
    public AppointmentDto completeAppointment(UUID id) {
        Appointment appt = findAccessible(id);
        if (appt.getStatus() != AppointmentStatus.IN_PROGRESS) {
            throw new BusinessRuleException("Only IN_PROGRESS appointments can be completed");
        }
        appt.setStatus(AppointmentStatus.COMPLETED);
        return appointmentMapper.toDto(appointmentRepository.save(appt));
    }

    public Page<AppointmentDto> listAppointments(Pageable pageable) {
        UUID tenantId = userContext.getCurrentTenantId();
        Role role = userContext.getCurrentRole();

        if (role == Role.DOCTOR) {
            UUID doctorId = userContext.getCurrentUserId();
            return appointmentRepository
                .findAllByTenantIdAndDoctorIdAndDeletedAtIsNull(tenantId, doctorId, pageable)
                .map(appointmentMapper::toDto);
        }

        return appointmentRepository
            .findAllByTenantIdAndDeletedAtIsNull(tenantId, pageable)
            .map(appointmentMapper::toDto);
    }

    public AppointmentDto getAppointment(UUID id) {
        return appointmentMapper.toDto(findAccessible(id));
    }

    public List<AppointmentDto> getWalkInQueue() {
        UUID tenantId = userContext.getCurrentTenantId();
        Role role = userContext.getCurrentRole();

        List<Appointment> queue;
        if (role == Role.DOCTOR) {
            UUID doctorId = userContext.getCurrentUserId();
            queue = appointmentRepository.findAllByTenantIdAndDoctorIdAndIsWalkinTrueAndDeletedAtIsNullAndStatusNot(
                tenantId, doctorId, AppointmentStatus.CANCELLED);
        } else {
            queue = appointmentRepository.findAllByTenantIdAndIsWalkinTrueAndDeletedAtIsNullAndStatusNot(
                tenantId, AppointmentStatus.CANCELLED);
        }

        return queue.stream().map(appointmentMapper::toDto).collect(Collectors.toList());
    }

    private Appointment findAccessible(UUID id) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + id));

        UUID tenantId = userContext.getCurrentTenantId();
        Role role = userContext.getCurrentRole();

        if (role != Role.SUPER_ADMIN && !appt.getTenantId().equals(tenantId)) {
            throw new BusinessRuleException("Appointment does not belong to your tenant");
        }

        if (role == Role.DOCTOR && !userContext.getCurrentUserId().equals(appt.getDoctorId())) {
            throw new BusinessRuleException("You can only access your own appointments");
        }

        return appt;
    }

    private void guardNotCancelled(Appointment appt) {
        if (appt.getStatus() == AppointmentStatus.CANCELLED) {
            throw new BusinessRuleException("Cancelled appointments cannot be modified");
        }
    }

    private void checkOverlap(UUID doctorId, Instant time, UUID excludeId) {
        Instant start = time.minus(30, ChronoUnit.MINUTES);
        Instant end = time.plus(30, ChronoUnit.MINUTES);
        UUID safeExclude = excludeId != null ? excludeId : UUID.randomUUID();
        if (appointmentRepository.existsOverlap(doctorId, start, end, safeExclude)) {
            throw new BusinessRuleException("Doctor already has an appointment within 30 minutes of this time");
        }
    }
}
