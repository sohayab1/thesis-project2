package com.cybercrime.dto;

import lombok.Data;

@Data
public class FeedbackDto {
    private Long complaintId;
    private String feedback;
    private Integer rating;
}