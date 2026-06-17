package com.example.customermanagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "processed_customers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProcessedCustomer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String email;

    private String phone;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "status_code", nullable = false)
    private String statusCode;

    @Column(name = "status_name", nullable = false)
    private String statusName;

    @Column(name = "image_url")
    private String imageUrl;

    @PrePersist
    protected void onCreate() {
        if (processedAt == null) processedAt = LocalDateTime.now();
    }
}
