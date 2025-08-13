package com.cybercrime.controller;

import com.cybercrime.dto.ComplaintDto;
import com.cybercrime.dto.DepartmentDto;
import com.cybercrime.dto.UserDto;
import com.cybercrime.service.AdminService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "http://localhost:5173")  // Add this line
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/pending-users")
    public ResponseEntity<List<UserDto>> getPendingUsers() {
        return ResponseEntity.ok(adminService.getPendingUsers());
    }

    @PutMapping("/approve-user/{userId}")
    public ResponseEntity<UserDto> approveUser(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.approveUser(userId));
    }

    @PutMapping("/reject-user/{userId}")
    public ResponseEntity<UserDto> rejectUser(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.rejectUser(userId));
    }

    @PostMapping("/departments")
    public ResponseEntity<DepartmentDto> createDepartment(@Valid @RequestBody DepartmentDto departmentDto) {
        return ResponseEntity.ok(adminService.createDepartment(departmentDto));
    }

    @GetMapping("/departments/{departmentId}/users")
    public ResponseEntity<List<UserDto>> getDepartmentUsers(@PathVariable Long departmentId) {
        return ResponseEntity.ok(adminService.getUsersByDepartment(departmentId));
    }

    @GetMapping("/complaints")
    @PreAuthorize("hasRole('ADMIN')")
    @Cacheable(value = "adminComplaints", key = "'all'")
    public ResponseEntity<List<ComplaintDto>> getAllComplaints() {
        List<ComplaintDto> complaints = adminService.getAllComplaints();
        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/complaints/statistics")
    public ResponseEntity<Map<String, Object>> getComplaintStatistics() {
        return ResponseEntity.ok(adminService.getComplaintStatistics());
    }
}