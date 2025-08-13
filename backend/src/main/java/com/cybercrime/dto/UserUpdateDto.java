// filepath: /home/anabil/Downloads/newfolder/cybercrime-reporting/backend/src/main/java/com/cybercrime/dto/UserUpdateDto.java
package com.cybercrime.dto;

import lombok.Data;

@Data
public class UserUpdateDto {
    private Long id;
    private String name;
    private String email;
    private String nidNumber;
    private Long departmentId;
    private String currentPassword;
    private String newPassword;
}