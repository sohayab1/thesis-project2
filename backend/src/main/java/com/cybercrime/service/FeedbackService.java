package com.cybercrime.service;

import com.cybercrime.dto.FeedbackDto;
import java.util.List;

public interface FeedbackService {
    FeedbackDto submitFeedback(Long complaintId, FeedbackDto feedbackDto);
    FeedbackDto getFeedback(Long complaintId);
    List<FeedbackDto> getAllFeedbacksByUser(Long userId);
    List<FeedbackDto> getAllFeedbacksByDepartment(Long departmentId);
    void deleteFeedback(Long complaintId);
    Double getAverageDepartmentRating(Long departmentId);
}