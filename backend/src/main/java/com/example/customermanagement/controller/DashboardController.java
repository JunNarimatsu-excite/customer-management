package com.example.customermanagement.controller;

import com.example.customermanagement.repository.LoginUserRepository;
import com.example.customermanagement.repository.ProcessedCustomerRepository;
import com.example.customermanagement.repository.CustomerStatusNameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class DashboardController {

    private final ProcessedCustomerRepository customerRepository;
    private final LoginUserRepository loginUserRepository;
    private final CustomerStatusNameRepository statusRepository;

    @GetMapping("/api/dashboard")
    public Map<String, Object> dashboard() {

        return Map.of(
                "customerCount", customerRepository.count(),
                "userCount", loginUserRepository.count(),
                "statusCount", statusRepository.count()
        );
    }
}