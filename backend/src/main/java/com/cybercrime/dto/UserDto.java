package com.cybercrime.dto;

import com.cybercrime.model.UserRole;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String nidNumber;
    private UserRole role;  // Changed: use UserRole enum instead of String
    private boolean approved;
    private Long departmentId;
}