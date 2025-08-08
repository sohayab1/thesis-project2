package com.cybercrime.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "departments")
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    @OneToMany(mappedBy = "department")
    private List<User> departmentAdmins;

    @OneToMany(mappedBy = "department")
    private List<Complaint> complaints;

    private boolean active = true;
}