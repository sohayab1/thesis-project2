package com.cybercrime.controller;

import com.cybercrime.dto.FeedbackDto;
import com.cybercrime.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {
    private final FeedbackService feedbackService;

    @PostMapping("/{complaintId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<FeedbackDto> submitFeedback(
            @PathVariable Long complaintId,
            @Valid @RequestBody FeedbackDto feedbackDto) {
        return ResponseEntity.ok(feedbackService.submitFeedback(complaintId, feedbackDto));
    }

    @GetMapping("/{complaintId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<FeedbackDto> getFeedback(@PathVariable Long complaintId) {
        return ResponseEntity.ok(feedbackService.getFeedback(complaintId));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<FeedbackDto>> getUserFeedbacks(@PathVariable Long userId) {
        return ResponseEntity.ok(feedbackService.getAllFeedbacksByUser(userId));
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_ADMIN')")
    public ResponseEntity<List<FeedbackDto>> getDepartmentFeedbacks(@PathVariable Long departmentId) {
        return ResponseEntity.ok(feedbackService.getAllFeedbacksByDepartment(departmentId));
    }

    @DeleteMapping("/{complaintId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long complaintId) {
        feedbackService.deleteFeedback(complaintId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/department/{departmentId}/rating")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_ADMIN')")
    public ResponseEntity<Double> getDepartmentAverageRating(@PathVariable Long departmentId) {
        return ResponseEntity.ok(feedbackService.getAverageDepartmentRating(departmentId));
    }
}
