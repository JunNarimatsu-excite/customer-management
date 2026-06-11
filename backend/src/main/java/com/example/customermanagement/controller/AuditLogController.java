package com.example.customermanagement.controller;

import com.example.customermanagement.model.AuditLog;
import com.example.customermanagement.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping("/api/audit-logs")
    public List<AuditLog> getLogs() {
        return auditLogRepository
                .findTop100ByOrderByCreatedAtDesc();
    }
}