package com.emr.modules.auth.service;

import com.emr.modules.auth.dto.*;
import com.emr.modules.user.entity.User;
import com.emr.modules.user.repository.UserRepository;
import com.emr.shared.exception.BusinessRuleException;
import com.emr.shared.exception.ResourceNotFoundException;
import com.emr.shared.security.AppUserDetails;
import com.emr.shared.security.AuthenticatedUserContext;
import com.emr.shared.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final UserDetailsService userDetailsService;
    private final AuthenticatedUserContext userContext;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!user.isActive()) {
            throw new BusinessRuleException("Account is deactivated");
        }

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        return buildAuthResponse(user);
    }

    public AuthResponse refresh(RefreshTokenRequest request) {
        String token = request.refreshToken();
        if (!jwtService.isRefreshToken(token)) {
            throw new BadCredentialsException("Invalid refresh token");
        }

        String email = jwtService.extractEmail(token);
        AppUserDetails userDetails = (AppUserDetails) userDetailsService.loadUserByUsername(email);

        if (!jwtService.isTokenValid(token, userDetails)) {
            throw new BadCredentialsException("Refresh token expired");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return buildAuthResponse(user);
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        AppUserDetails principal = userContext.getCurrentUser();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setFirstLoginPasswordResetRequired(false);
        userRepository.save(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        Map<String, Object> claims = Map.of(
            "userId", user.getId().toString(),
            "role", user.getRole().name(),
            "tenantId", user.getTenantId() != null ? user.getTenantId().toString() : ""
        );

        String accessToken = jwtService.generateToken(user.getEmail(), claims);
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        return new AuthResponse(
            accessToken,
            refreshToken,
            user.getId(),
            user.getEmail(),
            user.getRole().name(),
            user.getTenantId() != null ? user.getTenantId().toString() : null,
            user.isFirstLoginPasswordResetRequired()
        );
    }
}
