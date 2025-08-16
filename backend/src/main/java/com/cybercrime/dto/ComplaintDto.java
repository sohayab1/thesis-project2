package com.cybercrime.dto;

import lombok.Data;
import com.cybercrime.model.ComplaintPriority;
import com.cybercrime.model.ComplaintStatus;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ComplaintDto {
    private Long id;
    private String title;
    private String description;
    private ComplaintStatus status;
    private ComplaintPriority priority;
    private String location;
    private LocalDateTime incidentDate;
    private LocalDateTime createdAt;
    private String suspectInfo;
    private String suspectSocialMedia;
    private String suspectPhoneNumber;
    private Integer rating;
    private String feedback;
    private LocalDateTime feedbackDate;
    private List<EvidenceDto> evidences;
    private UserDto user;
    private DepartmentDto department;
}