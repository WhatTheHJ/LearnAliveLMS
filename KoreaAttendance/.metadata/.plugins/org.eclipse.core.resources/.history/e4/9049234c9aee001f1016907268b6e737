package com.korea.attendance.service;

import com.korea.attendance.model.User;
import com.korea.attendance.repository.AuthMapper;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final AuthMapper authMapper;

    public AuthService(AuthMapper authMapper) {
        this.authMapper = authMapper;
    }

    public Optional<User> findUserById(String userId) {
        return authMapper.findUserById(userId);
    }
}
