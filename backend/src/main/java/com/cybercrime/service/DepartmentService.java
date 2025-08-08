package com.cybercrime.service;

import com.cybercrime.dto.DepartmentDto;
import com.cybercrime.dto.DepartmentUpdateDto;
import com.cybercrime.dto.ComplaintDto;
import com.cybercrime.dto.UserDto;
import java.util.List;

public interface DepartmentService {
    List<DepartmentDto> getAllDepartments();
    DepartmentDto getDepartment(Long id);
    DepartmentDto createDepartment(DepartmentDto departmentDto);
    DepartmentDto updateDepartment(Long id, DepartmentUpdateDto updateDto);
    void deleteDepartment(Long id);
    List<ComplaintDto> getDepartmentComplaints(Long departmentId);
    List<UserDto> getDepartmentAdmins(Long departmentId);
    DepartmentDto addDepartmentAdmin(Long departmentId, Long userId);
    DepartmentDto removeDepartmentAdmin(Long departmentId, Long userId);
}