package com.cybercrime.dto;

import com.cybercrime.model.UserRole;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String nidNumber;
    private boolean isApproved;
    private UserRole role;
    private Long departmentId;
}