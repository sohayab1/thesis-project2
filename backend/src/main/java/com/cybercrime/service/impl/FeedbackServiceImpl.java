package com.cybercrime.service.impl;

import com.cybercrime.dto.FeedbackDto;
import com.cybercrime.model.Complaint;
import com.cybercrime.repository.ComplaintRepository;
import com.cybercrime.service.FeedbackService;
import com.cybercrime.exception.ResourceNotFoundException;
import com.cybercrime.exception.UnauthorizedException;
import com.cybercrime.mapper.EntityMapperService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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

        if (complaint.getFeedback() != null) {
            throw new IllegalStateException("Feedback already exists for this complaint");
        }
        
        complaint.setFeedback(feedbackDto.getFeedback());
        complaint.setRating(feedbackDto.getRating());
        complaint.setFeedbackDate(LocalDateTime.now());
        
        Complaint savedComplaint = complaintRepository.save(complaint);
        return mapper.toFeedbackDto(savedComplaint);
    }

    @Override
    public FeedbackDto getFeedback(Long complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
            .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
            
        if (complaint.getFeedback() == null) {
            throw new ResourceNotFoundException("No feedback found for this complaint");
        }
        
        return mapper.toFeedbackDto(complaint);
    }

    @Override
    public List<FeedbackDto> getAllFeedbacksByUser(Long userId) {
        return complaintRepository.findByUserIdAndFeedbackNotNull(userId).stream()
            .map(mapper::toFeedbackDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<FeedbackDto> getAllFeedbacksByDepartment(Long departmentId) {
        return complaintRepository.findByDepartmentIdAndFeedbackNotNull(departmentId).stream()
            .map(mapper::toFeedbackDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteFeedback(Long complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
            .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
            
        complaint.setFeedback(null);
        complaint.setRating(null);
        complaint.setFeedbackDate(null);
        
        complaintRepository.save(complaint);
    }

    @Override
    public Double getAverageDepartmentRating(Long departmentId) {
        return complaintRepository.getAverageDepartmentRating(departmentId)
            .orElse(0.0);
    }
}