package com.example.customermanagement.controller;

import com.example.customermanagement.model.CustomerStatusName;
import com.example.customermanagement.model.ProcessedCustomer;
import com.example.customermanagement.repository.CustomerStatusNameRepository;
import com.example.customermanagement.repository.ProcessedCustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.example.customermanagement.service.AuditLogService;
import jakarta.servlet.http.HttpSession;

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

    @Autowired
    private AuditLogService auditLogService;

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
    public ResponseEntity<?> createCustomer(
            @RequestBody ProcessedCustomer customer,
            HttpSession session) {
        try {
            prepareStatus(customer, DEFAULT_STATUS_CODE);
            ProcessedCustomer savedCustomer = customerRepository.save(customer);

            auditLogService.save(
                    session,
                    "顧客登録",
                    "processed_customers",
                    "customerId=" + savedCustomer.getId()
            );

            return ResponseEntity.ok(savedCustomer);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    /**
     * Update processed customer
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(
            @PathVariable Long id,
            @RequestBody ProcessedCustomer customer,
            HttpSession session) {
        Optional<ProcessedCustomer> existingCustomer = customerRepository.findById(id);
        if (existingCustomer.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ProcessedCustomer cust = existingCustomer.get();
        cust.setName(customer.getName());
        cust.setEmail(customer.getEmail());
        cust.setPhone(customer.getPhone());
        cust.setImageUrl(customer.getImageUrl());

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

        auditLogService.save(
                session,
                "顧客更新",
                "processed_customers",
                "customerId=" + updatedCustomer.getId()
        );

        return ResponseEntity.ok(updatedCustomer);
    }

    /**
     * Delete processed customer
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id, HttpSession session) {
        if (customerRepository.existsById(id)) {
            customerRepository.deleteById(id);

            auditLogService.save(
                    session,
                    "顧客削除",
                    "processed_customers",
                    "customerId=" + id
            );

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

    @GetMapping("/search")
    public Page<ProcessedCustomer> searchCustomers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String statusCode) {

        Pageable pageable = PageRequest.of(0, 20);

        if (name != null && !name.isBlank()) {
            return customerRepository.findByNameContainingIgnoreCase(name, pageable);
        }

        if (email != null && !email.isBlank()) {
            return customerRepository.findByEmailContainingIgnoreCase(email, pageable);
        }

        if (statusCode != null && !statusCode.isBlank()) {
            return customerRepository.findByStatusCode(statusCode, pageable);
        }

        return customerRepository.findAll(pageable);
    }

    @GetMapping("/page")
    public Page<ProcessedCustomer> getCustomersPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String statusCode) {

        Sort.Direction sortDirection =
                "desc".equalsIgnoreCase(direction)
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC;

        PageRequest pageRequest = PageRequest.of(
                page,
                size,
                Sort.by(sortDirection, sort)
        );

        if (name != null && !name.isBlank()
        && email != null && !email.isBlank()) {
            return customerRepository.findByNameContainingIgnoreCaseAndEmailContainingIgnoreCase(
                    name,
                    email,
                    pageRequest
            );
        }

        if (name != null && !name.isBlank()) {
            return customerRepository.findByNameContainingIgnoreCase(name, pageRequest);
        }

        if (email != null && !email.isBlank()) {
            return customerRepository.findByEmailContainingIgnoreCase(email, pageRequest);
        }

        if (name != null && !name.isBlank()) {
            return customerRepository.findByNameContainingIgnoreCase(
                    name,
                    pageRequest
            );
        }

        if (email != null && !email.isBlank()) {
            return customerRepository.findByEmailContainingIgnoreCase(
                    email,
                    pageRequest
            );
        }

        if (statusCode != null && !statusCode.isBlank()) {
            return customerRepository.findByStatusCode(
                    statusCode,
                    pageRequest
            );
        }

        return customerRepository.findAll(pageRequest);
    }
}
