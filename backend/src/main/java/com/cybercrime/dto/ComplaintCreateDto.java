// filepath: /home/anabil/Downloads/newfolder/cybercrime-reporting/backend/src/main/java/com/cybercrime/dto/ComplaintCreateDto.java
package com.cybercrime.dto;

import lombok.Data;
import java.time.LocalDateTime;

import com.cybercrime.model.Complaint.ComplaintPriority;

@Data
public class ComplaintCreateDto {
    private String title;
    private String description;
    private Long departmentId;
    private String location;
    private LocalDateTime incidentDate;
    private ComplaintPriority priority;
}