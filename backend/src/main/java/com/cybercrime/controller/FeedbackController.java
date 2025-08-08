package com.cybercrime.controller;

import com.cybercrime.dto.FeedbackDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {
    private final FeedbackService feedbackService;

    @PostMapping("/{complaintId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<FeedbackDto> submitFeedback(
            @PathVariable Long complaintId,
            @RequestBody FeedbackDto feedbackDto) {
        return ResponseEntity.ok(feedbackService.submitFeedback(complaintId, feedbackDto));
    }

    @GetMapping("/{complaintId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<FeedbackDto> getFeedback(@PathVariable Long complaintId) {
        return ResponseEntity.ok(feedbackService.getFeedback(complaintId));
    }
}
