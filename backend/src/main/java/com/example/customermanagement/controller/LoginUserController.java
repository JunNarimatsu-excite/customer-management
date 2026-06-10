package com.example.customermanagement.controller;

import com.example.customermanagement.model.LoginUser;
import com.example.customermanagement.service.LoginUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class LoginUserController {

    private final LoginUserService loginUserService;

    @GetMapping
    public List<LoginUser> getUsers() {
        return loginUserService.findAll();
    }

    @PostMapping
    public LoginUser createUser(@RequestBody LoginUser user) {
        return loginUserService.create(user);
    }

    @PutMapping("/{id}")
    public LoginUser updateUser(
            @PathVariable String id,
            @RequestBody LoginUser user) {
        return loginUserService.update(id, user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id) {
        loginUserService.delete(id);
    }
}