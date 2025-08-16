package com.cybercrime.config;

import com.cybercrime.model.Department;
import com.cybercrime.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
@Order(2)
public class DepartmentInitializer implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;

    @Override
    @Transactional  // Add this annotation
    public void run(String... args) {
        initializeDepartments();
    }

    private void initializeDepartments() {
        if (departmentRepository.count() == 0) {
            log.info("Initializing default departments...");
            
            List<Department> departments = Arrays.asList(
                createDepartment(
                    "Financial Crime",
                    "Handles cases related to financial fraud, money laundering, and banking scams"
                ),
                createDepartment(
                    "Online Fraud",
                    "Investigates cases of online scams, identity theft, and e-commerce fraud"
                ),
                createDepartment(
                    "Cyber Attack",
                    "Deals with hacking attempts, malware attacks, and cybersecurity breaches"
                )
            );

            try {
                departmentRepository.saveAll(departments);
                departmentRepository.flush(); // Force the save

                log.info("=".repeat(70));
                log.info("🏢 DEFAULT DEPARTMENTS CREATED SUCCESSFULLY!");
                departments.forEach(dept -> 
                    log.info("📋 Department: {} - {}", dept.getName(), dept.getDescription())
                );
                log.info("=".repeat(70));
            } catch (Exception e) {
                log.error("Failed to initialize departments: {}", e.getMessage());
            }
        } else {
            log.info("Departments already exist, skipping initialization");
        }
    }

    private Department createDepartment(String name, String description) {
        Department department = new Department();
        department.setName(name);
        department.setDescription(description);
        department.setActive(true);
        return department;
    }
}