package com.example.customermanagement.repository;

import com.example.customermanagement.model.ProcessedCustomer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcessedCustomerRepository extends JpaRepository<ProcessedCustomer, Long> {

    Page<ProcessedCustomer> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<ProcessedCustomer> findByEmailContainingIgnoreCase(String email, Pageable pageable);

    Page<ProcessedCustomer> findByNameContainingIgnoreCaseAndEmailContainingIgnoreCase(
        String name,
        String email,
        Pageable pageable
    );

    Page<ProcessedCustomer> findByStatusCode(String statusCode, Pageable pageable);
}