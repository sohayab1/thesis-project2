package com.cybercrime.service;

import com.cybercrime.dto.FeedbackDto;

public interface FeedbackService {
    FeedbackDto submitFeedback(Long complaintId, FeedbackDto feedbackDto);
    FeedbackDto getFeedback(Long complaintId);
}