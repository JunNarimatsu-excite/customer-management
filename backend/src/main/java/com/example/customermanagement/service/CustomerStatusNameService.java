package com.example.customermanagement.service;

import com.example.customermanagement.model.CustomerStatusName;
import com.example.customermanagement.repository.CustomerStatusNameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerStatusNameService {

    private final CustomerStatusNameRepository repository;

    public List<CustomerStatusName> findAll() {
        return repository.findAll();
    }

    public CustomerStatusName create(CustomerStatusName status) {
        return repository.save(status);
    }

    public CustomerStatusName update(String statusCode, CustomerStatusName status) {
        CustomerStatusName existing = repository.findById(statusCode)
                .orElseThrow(() -> new RuntimeException("ステータスが存在しません"));

        existing.setStatusName(status.getStatusName());

        return repository.save(existing);
    }

    public void delete(String statusCode) {
        repository.deleteById(statusCode);
    }
}