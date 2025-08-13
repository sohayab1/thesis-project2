package com.cybercrime.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FeedbackDto {
    private Long id;

    @NotBlank(message = "Feedback comment is required")
    private String comment;

    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private Integer rating;

    private LocalDateTime createdAt;
    private Long complaintId;
    private Long userId;
    private String feedback; // Add this field

    // Add getter and setter for feedback field
    public String getFeedback() {
        return this.comment;
    }

    public void setFeedback(String feedback) {
        this.comment = feedback;
    }
}