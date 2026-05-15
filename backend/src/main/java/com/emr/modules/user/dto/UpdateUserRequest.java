package com.emr.modules.user.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateUserRequest(
    @NotBlank String fullName,
    Boolean active
) {}
