package com.cybercrime.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ComplaintDto {
    private Long id;
    private String title;
    private String description;
    private String status;
    private LocalDateTime createdAt;
    private String location;
    private LocalDateTime incidentDate;
    private String priority;
    private LocalDateTime resolvedDate;
    private UserDto user;
    private DepartmentDto department;
    private List<EvidenceDto> evidences;
    private FeedbackDto feedback;
}