package com.emr.modules.user.mapper;

import com.emr.modules.user.dto.UserDto;
import com.emr.modules.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDto toDto(User user) {
        return new UserDto(
            user.getId(),
            user.getEmail(),
            user.getFullName(),
            user.getRole(),
            user.getTenantId(),
            user.isActive(),
            user.isFirstLoginPasswordResetRequired()
        );
    }
}
