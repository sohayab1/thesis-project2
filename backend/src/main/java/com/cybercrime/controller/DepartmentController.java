package com.cybercrime.controller;

import com.cybercrime.dto.DepartmentDto;
import com.cybercrime.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {
    private final DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<List<DepartmentDto>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @GetMapping("/{id}/complaints")
    public ResponseEntity<List<ComplaintDto>> getDepartmentComplaints(@PathVariable Long id) {
        return ResponseEntity.ok(departmentService.getDepartmentComplaints(id));
    }
}