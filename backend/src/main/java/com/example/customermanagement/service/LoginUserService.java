package com.example.customermanagement.service;

import com.example.customermanagement.model.LoginUser;
import com.example.customermanagement.repository.LoginUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LoginUserService {

    private final LoginUserRepository loginUserRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public List<LoginUser> findAll() {
        return loginUserRepository.findAll();
    }

    public LoginUser create(LoginUser user) {
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("USER");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return loginUserRepository.save(user);
    }

    public LoginUser update(String id, LoginUser user) {
        LoginUser existing = loginUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ユーザーが存在しません"));

        existing.setName(user.getName());
        existing.setEmail(user.getEmail());

        if (user.getRole() != null && !user.getRole().isBlank()) {
            existing.setRole(user.getRole());
        }

        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        return loginUserRepository.save(existing);
    }

    public void delete(String id) {
        loginUserRepository.deleteById(id);
    }
}