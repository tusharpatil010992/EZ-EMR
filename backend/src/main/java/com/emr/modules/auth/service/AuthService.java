package com.emr.modules.auth.service;

import com.emr.modules.auth.dto.LoginRequest;
import com.emr.modules.auth.dto.LoginResponse;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    public LoginResponse login(LoginRequest request) {
        // TODO: implement JWT authentication
        throw new UnsupportedOperationException("Auth not yet implemented");
    }
}
