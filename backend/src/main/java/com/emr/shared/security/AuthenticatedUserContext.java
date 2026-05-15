package com.emr.shared.security;

import com.emr.modules.user.entity.Role;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class AuthenticatedUserContext {

    public AppUserDetails getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof AppUserDetails)) {
            throw new IllegalStateException("No authenticated user in context");
        }
        return (AppUserDetails) auth.getPrincipal();
    }

    public UUID getCurrentUserId() {
        return getCurrentUser().getId();
    }

    public UUID getCurrentTenantId() {
        return getCurrentUser().getTenantId();
    }

    public Role getCurrentRole() {
        return getCurrentUser().getRole();
    }

    public boolean isSuperAdmin() {
        return getCurrentUser().getRole() == Role.SUPER_ADMIN;
    }
}
