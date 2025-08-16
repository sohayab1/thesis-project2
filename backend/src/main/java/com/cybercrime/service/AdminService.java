package com.cybercrime.service;

import com.cybercrime.dto.*;
import com.cybercrime.model.ComplaintPriority;
import com.cybercrime.model.ComplaintStatus;

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
    ComplaintDto resolveComplaint(Long complaintId);
    ComplaintDto assignDepartment(Long complaintId, Long departmentId);
    ComplaintDto updateComplaintStatus(Long complaintId, ComplaintStatus status);
    ComplaintDto updateComplaintPriority(Long complaintId, ComplaintPriority priority);
}