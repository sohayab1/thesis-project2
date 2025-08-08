package com.cybercrime.dto;

import java.util.List;

import lombok.Data;

@Data
public class DepartmentDto {
    private Long id;
    private String name;
    private String description;
    private boolean active;
    private List<Long> departmentAdminIds; // Reference to admin users
    private int complaintCount;
}