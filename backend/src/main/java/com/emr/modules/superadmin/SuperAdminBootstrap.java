package com.emr.modules.superadmin;

import com.emr.modules.user.entity.Role;
import com.emr.modules.user.entity.User;
import com.emr.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;

@Component
@RequiredArgsConstructor
@Slf4j
public class SuperAdminBootstrap implements ApplicationRunner {

    private static final String CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
    private final SecureRandom random = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.super-admin.email}")
    private String superAdminEmail;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (userRepository.existsByRole(Role.SUPER_ADMIN)) {
            return;
        }

        String plainPassword = generatePassword(16);
        User superAdmin = User.builder()
                .email(superAdminEmail)
                .fullName("Super Administrator")
                .role(Role.SUPER_ADMIN)
                .passwordHash(passwordEncoder.encode(plainPassword))
                .active(true)
                .firstLoginPasswordResetRequired(false)
                .build();

        userRepository.save(superAdmin);

        log.info("==============================================");
        log.info("SUPER_ADMIN created: {}", superAdminEmail);
        log.info("Generated password:  {}***", plainPassword.substring(0, 3));
        log.info("Full password stored securely — retrieve from startup log ONCE");
        log.info("Password: {}", plainPassword);
        log.info("==============================================");
    }

    private String generatePassword(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(CHARS.charAt(random.nextInt(CHARS.length())));
        }
        return sb.toString();
    }
}
