package com.cybercrime.dto;

import lombok.Data;

@Data
public class DepartmentDto {
    private Long id;
    private String name;
    private String description;
    private boolean active;
    private int complaintCount;
}