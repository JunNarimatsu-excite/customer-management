package com.example.customermanagement.service;

import com.example.customermanagement.model.AuditLog;
import com.example.customermanagement.model.LoginUser;
import com.example.customermanagement.repository.AuditLogRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void save(HttpSession session, String operation, String target, String detail) {

        LoginUser loginUser =
                (LoginUser) session.getAttribute("loginUser");

        if (loginUser == null) {
            return;
        }

        AuditLog log = new AuditLog();
        log.setLoginId(loginUser.getId());
        log.setUserName(loginUser.getName());
        log.setOperation(operation);
        log.setTarget(target);
        log.setDetail(detail);

        auditLogRepository.save(log);
    }
}