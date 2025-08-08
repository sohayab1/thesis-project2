package com.cybercrime.service.impl;

import com.cybercrime.dto.FeedbackDto;
import com.cybercrime.model.Complaint;
import com.cybercrime.repository.ComplaintRepository;
import com.cybercrime.service.FeedbackService;
import com.cybercrime.exception.ResourceNotFoundException;
import com.cybercrime.mapper.EntityMapperService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {
    private final ComplaintRepository complaintRepository;
    private final EntityMapperService mapper;

    @Override
    @Transactional
    public FeedbackDto submitFeedback(Long complaintId, FeedbackDto feedbackDto) {
        Complaint complaint = complaintRepository.findById(complaintId)
            .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        
        complaint.setFeedback(feedbackDto.getFeedback());
        complaint.setRating(feedbackDto.getRating());
        
        Complaint savedComplaint = complaintRepository.save(complaint);
        return mapper.toFeedbackDto(savedComplaint);
    }

    @Override
    public FeedbackDto getFeedback(Long complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
            .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        return mapper.toFeedbackDto(complaint);
    }
}