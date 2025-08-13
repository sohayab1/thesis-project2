// filepath: /home/anabil/Downloads/newfolder/cybercrime-reporting/backend/src/main/java/com/cybercrime/dto/ComplaintCreateDto.java
package com.cybercrime.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ComplaintCreateDto {
    private String title;
    private String description;

    private String location;

    private LocalDateTime incidentDate;

    private String priority;  // This should match one of the ComplaintPriority enum values

    private Long departmentId;
}