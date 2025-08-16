package com.cybercrime.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "departments")
public class Department extends BaseEntity {
    private String name;
    private String description;
    private boolean active;

    /**
     * Users that belong to this department.
     * Mapping: User has a `@ManyToOne` field named "department".
     * This will include admins and regular users assigned to the department.
     */
    @OneToMany(mappedBy = "department", cascade = CascadeType.PERSIST, orphanRemoval = false)
    private List<com.cybercrime.model.User> departmentAdmins = new ArrayList<>();

    /**
     * Complaints assigned to this department.
     * Initialize to empty list to avoid NPEs when calling size(), isEmpty(), etc.
     */
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<com.cybercrime.model.Complaint> complaints = new ArrayList<>();
}
