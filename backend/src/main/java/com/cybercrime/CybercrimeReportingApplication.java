package com.cybercrime;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.cybercrime")
@EntityScan("com.cybercrime.model")
@EnableJpaRepositories("com.cybercrime.repository")
public class CybercrimeReportingApplication {
    public static void main(String[] args) {
        SpringApplication.run(CybercrimeReportingApplication.class, args);
    }
}
