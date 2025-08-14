package com.cybercrime.controller;

import com.cybercrime.dto.*;
import com.cybercrime.exception.UnauthorizedException;
import com.cybercrime.model.UserRole;
import com.cybercrime.security.CustomUserDetails;
import com.cybercrime.service.ComplaintService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/complaints")
@RequiredArgsConstructor
public class ComplaintController {
    private final ComplaintService complaintService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ComplaintDto> createComplaint(
            @Valid @RequestPart("complaint") ComplaintCreateDto complaintDto,
            @RequestPart(value = "evidences", required = false) List<MultipartFile> evidences,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(complaintService.createComplaint(complaintDto, evidences, userDetails.getUser().getId()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ComplaintDto>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ComplaintDto> getComplaint(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.getComplaint(id));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ComplaintDto> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ComplaintStatusUpdateDto statusUpdate) {
        return ResponseEntity.ok(complaintService.updateStatus(id, statusUpdate));
    }

    @PostMapping("/{id}/feedback")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ComplaintDto> addFeedback(
            @PathVariable Long id,
            @Valid @RequestBody FeedbackDto feedbackDto) {
        return ResponseEntity.ok(complaintService.addFeedback(id, feedbackDto));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<ComplaintDto>> getUserComplaints(@PathVariable Long userId) {
        return ResponseEntity.ok(complaintService.getUserComplaints(userId));
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_ADMIN')")
    public ResponseEntity<List<ComplaintDto>> getComplaintsByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(complaintService.getComplaintsByDepartment(departmentId));
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ComplaintDto> resolveComplaint(
        @PathVariable Long id,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        // Only allow users to resolve their own complaints or admins to resolve any complaint
        ComplaintDto complaint = complaintService.getComplaint(id);
        if (userDetails.getUser().getRole() != UserRole.ADMIN && 
            !complaint.getUser().getId().equals(userDetails.getUser().getId())) {
            throw new UnauthorizedException("You can only resolve your own complaints");
        }
        return ResponseEntity.ok(complaintService.resolveComplaint(id));
    }
}