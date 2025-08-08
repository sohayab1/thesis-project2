package com.cybercrime.dto;

import lombok.Data;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class DepartmentDto {
    private Long id;
    
    @NotBlank(message = "Department name is required")
    @Size(min = 2, max = 100)
    private String name;
    
    @Size(max = 500)
    private String description;
    
    private boolean active = true;
    private List<Long> adminUserIds;
    private int complaintCount;
    private int pendingComplaintCount;
}