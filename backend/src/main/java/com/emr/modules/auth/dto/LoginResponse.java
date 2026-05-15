package com.emr.modules.auth.dto;

public record LoginResponse(String token, String email, String tenantId) {}
