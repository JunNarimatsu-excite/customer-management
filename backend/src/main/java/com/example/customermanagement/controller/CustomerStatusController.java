package com.example.customermanagement.controller;

import com.example.customermanagement.model.CustomerStatusName;
import com.example.customermanagement.service.CustomerStatusNameService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/statuses")
@RequiredArgsConstructor
public class CustomerStatusController {

    private final CustomerStatusNameService service;

    @GetMapping
    public List<CustomerStatusName> getAllStatuses() {
        return service.findAll();
    }

    @PostMapping
    public CustomerStatusName createStatus(@RequestBody CustomerStatusName status) {
        return service.create(status);
    }

    @PutMapping("/{statusCode}")
    public CustomerStatusName updateStatus(
            @PathVariable String statusCode,
            @RequestBody CustomerStatusName status) {
        return service.update(statusCode, status);
    }

    @DeleteMapping("/{statusCode}")
    public void deleteStatus(@PathVariable String statusCode) {
        service.delete(statusCode);
    }
}
