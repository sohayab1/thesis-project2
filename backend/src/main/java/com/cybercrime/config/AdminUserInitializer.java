package com.cybercrime.config;

import com.cybercrime.model.User;
import com.cybercrime.model.UserRole;
import com.cybercrime.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminUserInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createDefaultAdminUser();
    }

    private void createDefaultAdminUser() {
        String adminEmail = "admin@cybercrime.gov.bd";
        
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setName("System Administrator");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setNidNumber("1234567890123");
            admin.setRole(UserRole.ADMIN);
            admin.setApproved(true);  // Admin is pre-approved
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());
            
            userRepository.save(admin);
            
            log.info("=".repeat(70));
            log.info("🔐 DEFAULT ADMIN USER CREATED SUCCESSFULLY!");
            log.info("📧 Email: {}", adminEmail);
            log.info("🔑 Password: Admin@123");
            log.info("👤 Role: ADMIN");
            log.info("✅ Status: APPROVED & ACTIVE");
            log.info("=".repeat(70));
        }
    }
}