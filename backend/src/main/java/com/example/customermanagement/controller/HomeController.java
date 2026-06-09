package com.example.customermanagement.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, String> home() {
        return Map.of(
                "service", "Customer Management API",
                "status", "ok",
                "api", "/api/customers"
        );
    }
}
