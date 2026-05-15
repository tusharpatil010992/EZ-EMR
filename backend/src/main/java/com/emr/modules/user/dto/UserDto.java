package com.emr.modules.user.dto;

import com.emr.modules.user.entity.Role;

import java.util.UUID;

public record UserDto(
    UUID id,
    String email,
    String fullName,
    Role role,
    UUID tenantId,
    boolean active,
    boolean firstLoginPasswordResetRequired
) {}
