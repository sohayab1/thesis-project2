package com.cybercrime.dto;

import com.cybercrime.model.Complaint.ComplaintPriority;
import com.cybercrime.model.ComplaintStatus;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ComplaintDto {
    private Long id;
    private String title;
    private String description;
    private Long departmentId;
    private Long userId;
    private String location;
    private LocalDateTime incidentDate;
    private LocalDateTime createdAt;
    private ComplaintStatus status;
    private Integer rating;
    private String feedback;
    private List<EvidenceDto> evidences;
    private LocalDateTime resolvedDate;
    private String resolutionNotes;
    private ComplaintPriority priority;
}