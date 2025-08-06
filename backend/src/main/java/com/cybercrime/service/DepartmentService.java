package com.cybercrime.service;

import com.cybercrime.dto.DepartmentDto;
import com.cybercrime.dto.ComplaintDto;
import java.util.List;

public interface DepartmentService {
    List<DepartmentDto> getAllDepartments();
    List<ComplaintDto> getDepartmentComplaints(Long departmentId);
    DepartmentDto getDepartment(Long id);
}