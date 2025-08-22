// filepath: /home/anabil/Downloads/newfolder/cybercrime-reporting/backend/src/main/java/com/cybercrime/dto/ComplaintCreateDto.java
package com.cybercrime.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ComplaintCreateDto {
    @NotBlank
    private String title;
    
    @NotBlank
    private String description;
    
    @NotNull
    private Long departmentId;
    
    @NotBlank
    private String location;
    
    @NotNull
    private LocalDateTime incidentDate;
    
    private String suspectInfo;
    private String suspectSocialMedia;
    private String suspectPhoneNumber;
}