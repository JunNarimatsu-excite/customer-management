package com.example.customermanagement;

import com.example.customermanagement.model.CustomerStatusName;
import com.example.customermanagement.repository.CustomerStatusNameRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CustomerStatusNameRepository statusNameRepository;
    private final JdbcTemplate jdbcTemplate;

    public DataInitializer(CustomerStatusNameRepository statusNameRepository, JdbcTemplate jdbcTemplate) {
        this.statusNameRepository = statusNameRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        dropStaleCustomerIdColumn();
        initializeStatusNames();
    }

    private void dropStaleCustomerIdColumn() {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM information_schema.columns WHERE table_name = 'processed_customers' AND column_name = 'customer_id'",
                Integer.class);
        if (count != null && count > 0) {
            jdbcTemplate.execute("ALTER TABLE processed_customers DROP COLUMN customer_id");
        }
    }

    private void initializeStatusNames() {
        if (statusNameRepository.count() == 0) {
            List<CustomerStatusName> defaultStatuses = List.of(
                    new CustomerStatusName("ST01", "新規"),
                    new CustomerStatusName("ST02", "アクティブ"),
                    new CustomerStatusName("ST03", "非アクティブ"),
                    new CustomerStatusName("ST04", "退会")
            );
            statusNameRepository.saveAll(defaultStatuses);
        }
    }
}
