package com.example.customermanagement.repository;

import com.example.customermanagement.model.LoginUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoginUserRepository
        extends JpaRepository<LoginUser, String> {
}