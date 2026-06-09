package com.example.customermanagement.repository;

import com.example.customermanagement.model.ProcessedCustomer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessedCustomerRepository extends JpaRepository<ProcessedCustomer, Long> {
}
