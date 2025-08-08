package com.cybercrime.controller;

import com.cybercrime.dto.ComplaintCreateDto;
import com.cybercrime.dto.ComplaintDto;
import com.cybercrime.dto.ComplaintStatusUpdateDto;
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
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ComplaintDto> createComplaint(
            @RequestBody ComplaintCreateDto complaintDto,
            @RequestPart List<MultipartFile> evidences) {
        return ResponseEntity.ok(complaintService.createComplaint(complaintDto, evidences));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<ComplaintDto>> getUserComplaints(@PathVariable Long userId) {
        return ResponseEntity.ok(complaintService.getUserComplaints(userId));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ComplaintDto> updateComplaintStatus(
            @PathVariable Long id,
            @RequestBody ComplaintStatusUpdateDto statusUpdate) {
        return ResponseEntity.ok(complaintService.updateStatus(id, statusUpdate.getStatus()));
    }
}