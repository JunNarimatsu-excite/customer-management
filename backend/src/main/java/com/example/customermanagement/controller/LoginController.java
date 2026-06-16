package com.example.customermanagement.controller;

import com.example.customermanagement.model.LoginRequest;
import com.example.customermanagement.model.LoginUser;
import com.example.customermanagement.service.LoginService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://20.196.152.70:30080", allowCredentials = "true")
public class LoginController {

    private final LoginService loginService;

    @PostMapping("/login")
    public Map<String, Object> login(
            @RequestBody LoginRequest request,
            HttpSession session) {

        LoginUser user = loginService.login(
                request.getId(),
                request.getPassword()
        );

        if (user == null) {
            return Map.of(
                    "success", false,
                    "message", "IDまたはパスワードが違います"
            );
        }

        session.setAttribute("loginUser", user);

        return Map.of(
            "success", true,
            "id",    user.getId(),
            "name",  user.getName(),
            "email", user.getEmail(),
            "role",  user.getRole()
        );
    }

    @GetMapping("/me")
    public Map<String, Object> me(HttpSession session) {

        LoginUser user =
                (LoginUser) session.getAttribute("loginUser");

        if (user == null) {
            return Map.of("login", false);
        }

        return Map.of(
            "success", true,
            "id",    user.getId(),
            "name",  user.getName(),
            "email", user.getEmail(),
            "role",  user.getRole()
        );
    }

    @PostMapping("/logout")
    public Map<String, Object> logout(HttpSession session) {
        session.invalidate();

        return Map.of("success", true);
    }
}