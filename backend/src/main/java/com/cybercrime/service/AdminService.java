package com.cybercrime.service;

import com.cybercrime.dto.*;
import java.util.List;
import java.util.Map;

public interface AdminService {
    List<UserDto> getAllUsers();
    List<UserDto> getPendingUsers();
    UserDto approveUser(Long userId);
    UserDto rejectUser(Long userId);
    DepartmentDto createDepartment(DepartmentDto departmentDto);
    List<UserDto> getUsersByDepartment(Long departmentId);
    void deleteDepartment(Long departmentId);
    DepartmentDto updateDepartment(Long departmentId, DepartmentDto departmentDto);
    List<ComplaintDto> getAllComplaints();
    Map<String, Object> getComplaintStatistics();
}