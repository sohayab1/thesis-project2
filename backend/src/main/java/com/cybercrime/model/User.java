package com.cybercrime.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;
    private String nidNumber;
    private boolean approved;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    private String nidFrontPath;
    private String nidBackPath;
    private String selfieFrontPath;
    private String selfieLeftPath;
    private String selfieRightPath;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}