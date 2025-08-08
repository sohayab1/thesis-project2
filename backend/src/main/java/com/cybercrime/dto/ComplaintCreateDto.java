// filepath: /home/anabil/Downloads/newfolder/cybercrime-reporting/backend/src/main/java/com/cybercrime/dto/ComplaintCreateDto.java
package com.cybercrime.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;
import com.cybercrime.model.Complaint.ComplaintPriority;

@Data
public class ComplaintCreateDto {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Department is required")
    private Long departmentId;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Incident date is required")
    private LocalDateTime incidentDate;

    private ComplaintPriority priority;
}