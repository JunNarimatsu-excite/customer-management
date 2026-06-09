package com.example.customermanagement.controller;

import com.example.customermanagement.model.CustomerStatusName;
import com.example.customermanagement.repository.CustomerStatusNameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/statuses")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CustomerStatusController {

    @Autowired
    private CustomerStatusNameRepository statusNameRepository;

    @GetMapping
    public List<CustomerStatusName> getAllStatuses() {
        return statusNameRepository.findAll();
    }
}
