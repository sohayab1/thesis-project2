package com.cybercrime.config;

import com.cybercrime.model.Department;
import com.cybercrime.model.User;
import com.cybercrime.model.UserRole;
import com.cybercrime.repository.DepartmentRepository;
import com.cybercrime.repository.UserRepository;
import com.cybercrime.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
@Order(3)
public class AdminUserInitializer implements CommandLineRunner {
    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DepartmentRepository departmentRepository;

    @Override
    @Transactional
    public void run(String... args) {
        initializeAdmins();
    }

    private void initializeAdmins() {
        // Create super admin if not exists
        if (userRepository.findByEmail("admin@admin.com").isEmpty()) {
            User admin = new User();
            admin.setName("Super Admin");
            admin.setEmail("admin@admin.com");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRole(UserRole.ADMIN);
            admin.setApproved(true);  // Admin is pre-approved
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());

            userService.save(admin);

            log.info("=".repeat(70));
            log.info("👤 SUPER ADMIN CREATED SUCCESSFULLY!");
            log.info("📧 Email: admin@admin.com");
            log.info("🔑 Password: admin");
            log.info("=".repeat(70));
        }

        // Create department admins
        createDepartmentAdmin("Financial Crime", "financial.admin@cyber.com");
        createDepartmentAdmin("Online Fraud", "fraud.admin@cyber.com");
        createDepartmentAdmin("Cyber Attack", "cyber.admin@cyber.com");
    }

    private void createDepartmentAdmin(String departmentName, String email) {
        if (userRepository.findByEmail(email).isEmpty()) {
            Department department = departmentRepository.findByName(departmentName)
                .orElseThrow(() -> new RuntimeException("Department not found: " + departmentName));

            User admin = new User();
            admin.setName(departmentName + " Admin");
            admin.setEmail(email);
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRole(UserRole.DEPARTMENT_ADMIN);
            admin.setApproved(true);
            admin.setDepartment(department);
            userRepository.save(admin);

            log.info("=".repeat(70));
            log.info("👤 DEPARTMENT ADMIN CREATED: {}", departmentName);
            log.info("📧 Email: {}", email);
            log.info("🔑 Password: admin");
            log.info("=".repeat(70));
        }
    }
}