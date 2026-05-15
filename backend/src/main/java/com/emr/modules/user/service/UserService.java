package com.emr.modules.user.service;

import com.emr.modules.user.dto.CreateUserRequest;
import com.emr.modules.user.dto.CreateUserResponse;
import com.emr.modules.user.dto.UpdateUserRequest;
import com.emr.modules.user.dto.UserDto;

import java.util.List;
import java.util.UUID;

public interface UserService {
    CreateUserResponse createUser(CreateUserRequest request, UUID callerTenantId);
    List<UserDto> listUsers(UUID tenantId);
    UserDto updateUser(UUID id, UpdateUserRequest request, UUID callerTenantId);
    void deactivateUser(UUID id, UUID callerTenantId);
}
