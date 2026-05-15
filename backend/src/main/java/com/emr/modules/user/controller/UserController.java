package com.emr.modules.user.controller;

import com.emr.modules.user.dto.CreateUserRequest;
import com.emr.modules.user.dto.CreateUserResponse;
import com.emr.modules.user.dto.UpdateUserRequest;
import com.emr.modules.user.dto.UserDto;
import com.emr.modules.user.service.UserService;
import com.emr.shared.security.AuthenticatedUserContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "Users")
public class UserController {

    private final UserService userService;
    private final AuthenticatedUserContext userContext;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Create a user (ADMIN creates DOCTOR/STAFF in own tenant)")
    public ResponseEntity<CreateUserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        UUID tenantId = userContext.getCurrentTenantId();
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(request, tenantId));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "List users in caller's tenant")
    public ResponseEntity<List<UserDto>> listUsers() {
        UUID tenantId = userContext.getCurrentTenantId();
        return ResponseEntity.ok(userService.listUsers(tenantId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Update user")
    public ResponseEntity<UserDto> updateUser(@PathVariable UUID id,
                                              @Valid @RequestBody UpdateUserRequest request) {
        UUID tenantId = userContext.getCurrentTenantId();
        return ResponseEntity.ok(userService.updateUser(id, request, tenantId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Deactivate user")
    public ResponseEntity<Void> deactivateUser(@PathVariable UUID id) {
        UUID tenantId = userContext.getCurrentTenantId();
        userService.deactivateUser(id, tenantId);
        return ResponseEntity.noContent().build();
    }
}
