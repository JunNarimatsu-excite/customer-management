package com.example.customermanagement.controller;

import com.example.customermanagement.model.CustomerStatusName;
import com.example.customermanagement.model.ProcessedCustomer;
import com.example.customermanagement.repository.CustomerStatusNameRepository;
import com.example.customermanagement.repository.ProcessedCustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
/* @CrossOrigin(origins = "*", maxAge = 3600) */
public class CustomerController {

    private static final String DEFAULT_STATUS_CODE = "ST01";

    @Autowired
    private ProcessedCustomerRepository customerRepository;

    @Autowired
    private CustomerStatusNameRepository statusNameRepository;

    /**
     * Get all processed customers
     */
    @GetMapping
    public List<ProcessedCustomer> getAllCustomers() {
        return customerRepository.findAll();
    }

    /**
     * Get customer by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProcessedCustomer> getCustomerById(@PathVariable Long id) {
        Optional<ProcessedCustomer> customer = customerRepository.findById(id);
        return customer.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Get all status options
     */
    @GetMapping("/statuses")
    public List<CustomerStatusName> getStatusNames() {
        return statusNameRepository.findAll();
    }

    /**
     * Create a new processed customer
     */
    @PostMapping
    public ResponseEntity<?> createCustomer(@RequestBody ProcessedCustomer customer) {
        try {
            prepareStatus(customer, DEFAULT_STATUS_CODE);
            ProcessedCustomer savedCustomer = customerRepository.save(customer);
            return ResponseEntity.ok(savedCustomer);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    /**
     * Update processed customer
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable Long id, @RequestBody ProcessedCustomer customer) {
        Optional<ProcessedCustomer> existingCustomer = customerRepository.findById(id);
        if (existingCustomer.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ProcessedCustomer cust = existingCustomer.get();
        cust.setName(customer.getName());
        cust.setEmail(customer.getEmail());
        cust.setPhone(customer.getPhone());

        if (customer.getStatusCode() != null && !customer.getStatusCode().isBlank()) {
            try {
                prepareStatus(customer, customer.getStatusCode());
                cust.setStatusCode(customer.getStatusCode());
                cust.setStatusName(customer.getStatusName());
            } catch (IllegalArgumentException ex) {
                return ResponseEntity.badRequest().body(ex.getMessage());
            }
        }

        ProcessedCustomer updatedCustomer = customerRepository.save(cust);
        return ResponseEntity.ok(updatedCustomer);
    }

    /**
     * Delete processed customer
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        if (customerRepository.existsById(id)) {
            customerRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    private void prepareStatus(ProcessedCustomer customer, String statusCode) {
        String resolvedCode = statusCode;
        if (resolvedCode == null || resolvedCode.isBlank()) {
            resolvedCode = DEFAULT_STATUS_CODE;
        }
        final String finalStatusCode = resolvedCode;
        CustomerStatusName status = statusNameRepository.findById(finalStatusCode)
                .orElseThrow(() -> new IllegalArgumentException("Unknown status code: " + finalStatusCode));

        customer.setStatusCode(finalStatusCode);
        customer.setStatusName(status.getStatusName());
    }
}
