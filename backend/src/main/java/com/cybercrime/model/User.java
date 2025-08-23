package com.cybercrime.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    @Column(unique = true)
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

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;  // For department admins

    @OneToMany(mappedBy = "user")
    private List<Complaint> complaints;

    @Column(columnDefinition = "TEXT")
    private String userFeedback;

    @Column(name = "user_rating")
    private Integer userRating;  // Add this field

    private LocalDateTime lastFeedbackDate;  // Add this field

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}