package com.emr.modules.user.service;

import com.emr.modules.user.dto.CreateUserRequest;
import com.emr.modules.user.dto.CreateUserResponse;
import com.emr.modules.user.dto.UpdateUserRequest;
import com.emr.modules.user.dto.UserDto;
import com.emr.modules.user.entity.User;
import com.emr.modules.user.mapper.UserMapper;
import com.emr.modules.user.repository.UserRepository;
import com.emr.shared.exception.BusinessRuleException;
import com.emr.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private static final String CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
    private final SecureRandom random = new SecureRandom();

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public CreateUserResponse createUser(CreateUserRequest request, UUID callerTenantId) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessRuleException("Email already in use: " + request.email());
        }

        String plainPassword = generatePassword(16);
        User user = User.builder()
                .tenantId(callerTenantId)
                .email(request.email())
                .fullName(request.fullName())
                .role(request.role())
                .passwordHash(passwordEncoder.encode(plainPassword))
                .firstLoginPasswordResetRequired(true)
                .active(true)
                .build();

        user = userRepository.save(user);
        return new CreateUserResponse(user.getId(), user.getEmail(), plainPassword);
    }

    @Override
    public List<UserDto> listUsers(UUID tenantId) {
        return userRepository.findAllByTenantId(tenantId).stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserDto updateUser(UUID id, UpdateUserRequest request, UUID callerTenantId) {
        User user = findUserInTenant(id, callerTenantId);
        user.setFullName(request.fullName());
        if (request.active() != null) {
            user.setActive(request.active());
        }
        return userMapper.toDto(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deactivateUser(UUID id, UUID callerTenantId) {
        User user = findUserInTenant(id, callerTenantId);
        user.setActive(false);
        userRepository.save(user);
    }

    private User findUserInTenant(UUID id, UUID tenantId) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        if (!user.getTenantId().equals(tenantId)) {
            throw new BusinessRuleException("User does not belong to your tenant");
        }
        return user;
    }

    private String generatePassword(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(CHARS.charAt(random.nextInt(CHARS.length())));
        }
        return sb.toString();
    }
}
