package com.emr.modules.user.dto;

import com.emr.modules.user.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateUserRequest(
    @NotBlank @Email String email,
    @NotBlank String fullName,
    @NotNull Role role
) {}
