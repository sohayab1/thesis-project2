package com.cybercrime.controller;

import com.cybercrime.dto.ComplaintDto;
import com.cybercrime.dto.DepartmentDto;
import com.cybercrime.dto.UserDto;
import com.cybercrime.service.AdminService;
import com.cybercrime.service.EmailService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
// Remove /api since it's already in context-path
@RequestMapping("/admin")  // Changed from "/api/admin"
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;
    private final EmailService emailService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/users/pending")
    public ResponseEntity<List<UserDto>> getPendingUsers() {
        return ResponseEntity.ok(adminService.getPendingUsers());
    }

    @PutMapping("/users/{userId}/approve")
    public ResponseEntity<UserDto> approveUser(@PathVariable Long userId) {
        try {
            UserDto approvedUser = adminService.approveUser(userId);
            emailService.sendApprovalEmail(approvedUser.getEmail(), approvedUser.getName(), true);
            return ResponseEntity.ok(approvedUser);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to approve user: " + e.getMessage());
        }
    }

    @PutMapping("/users/{userId}/reject")
    public ResponseEntity<UserDto> rejectUser(@PathVariable Long userId) {
        UserDto user = adminService.rejectUser(userId);
        emailService.sendApprovalEmail(user.getEmail(), user.getName(), false);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/departments")
    public ResponseEntity<DepartmentDto> createDepartment(@Valid @RequestBody DepartmentDto departmentDto) {
        return ResponseEntity.ok(adminService.createDepartment(departmentDto));
    }

    @GetMapping("/departments/{departmentId}/users")
    public ResponseEntity<List<UserDto>> getDepartmentUsers(@PathVariable Long departmentId) {
        return ResponseEntity.ok(adminService.getUsersByDepartment(departmentId));
    }

    @GetMapping("/complaints/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ComplaintDto>> getAllComplaints() {
        return ResponseEntity.ok(adminService.getAllComplaints());
    }

    @GetMapping("/complaints/statistics")
    public ResponseEntity<Map<String, Object>> getComplaintStatistics() {
        return ResponseEntity.ok(adminService.getComplaintStatistics());
    }

    @PutMapping("/complaints/{complaintId}/resolve")
    public ResponseEntity<ComplaintDto> resolveComplaint(@PathVariable Long complaintId) {
        return ResponseEntity.ok(adminService.resolveComplaint(complaintId));
    }

    @PutMapping("/complaints/{complaintId}/department/{departmentId}")
    public ResponseEntity<ComplaintDto> assignDepartment(
        @PathVariable Long complaintId,
        @PathVariable Long departmentId
    ) {
        return ResponseEntity.ok(adminService.assignDepartment(complaintId, departmentId));
    }
}