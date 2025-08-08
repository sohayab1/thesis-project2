package com.cybercrime.dto;

import lombok.Data;
import java.util.List;

@Data
public class AdminDto {
    private Long id;
    private String name;
    private String email;
    private List<String> permissions;
    private List<Long> managedDepartments;
    private boolean superAdmin;
}