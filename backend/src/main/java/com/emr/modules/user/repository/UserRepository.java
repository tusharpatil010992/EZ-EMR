package com.emr.modules.user.repository;

import com.emr.modules.user.entity.Role;
import com.emr.modules.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    List<User> findAllByTenantId(UUID tenantId);
    boolean existsByEmail(String email);
    boolean existsByRole(Role role);
}
