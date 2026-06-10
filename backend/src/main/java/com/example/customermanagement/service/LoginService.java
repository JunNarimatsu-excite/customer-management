package com.example.customermanagement.service;

import com.example.customermanagement.model.LoginUser;
import com.example.customermanagement.repository.LoginUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final LoginUserRepository loginUserRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public LoginUser login(String id, String password) {
        LoginUser user = loginUserRepository.findById(id).orElse(null);

        if (user == null) {
            return null;
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return null;
        }

        return user;
    }
}