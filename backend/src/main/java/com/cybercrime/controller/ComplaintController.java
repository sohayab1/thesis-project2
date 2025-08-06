package com.cybercrime.controller;


import com.cybercrime.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {
    private final ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<Complaint> createComplaint(
            @RequestPart("complaint") Complaint complaint,
            @RequestPart(value = "evidences", required = false) List<MultipartFile> evidences) {
        return ResponseEntity.ok(complaintService.createComplaint(complaint, evidences));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_ADMIN')")
    public ResponseEntity<Complaint> updateStatus(
            @PathVariable Long id,
            @RequestBody ComplaintStatus status) {
        return ResponseEntity.ok(complaintService.updateStatus(id, status));
    }

    @PostMapping("/{id}/feedback")
    public ResponseEntity<Complaint> addFeedback(
            @PathVariable Long id,
            @RequestParam String feedback,
            @RequestParam Integer rating) {
        return ResponseEntity.ok(complaintService.addFeedback(id, feedback, rating));
    }
}