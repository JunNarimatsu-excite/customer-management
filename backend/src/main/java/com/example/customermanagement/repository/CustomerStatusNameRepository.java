package com.example.customermanagement.repository;

import com.example.customermanagement.model.CustomerStatusName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerStatusNameRepository extends JpaRepository<CustomerStatusName, String> {
}
