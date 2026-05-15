package com.emr.modules.user.dto;

import java.util.UUID;

public record CreateUserResponse(
    UUID userId,
    String email,
    String generatedPassword
) {}
