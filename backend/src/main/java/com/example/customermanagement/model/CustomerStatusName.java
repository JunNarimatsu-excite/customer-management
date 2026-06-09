package com.example.customermanagement.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "customer_status_name")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerStatusName {

    @Id
    @Column(name = "status_code", length = 20)
    private String statusCode;

    @Column(name = "status_name", nullable = false)
    private String statusName;
}
