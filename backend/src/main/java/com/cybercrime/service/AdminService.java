package com.cybercrime.service;

import com.cybercrime.dto.DepartmentDto;
import com.cybercrime.dto.UserDto;
import java.util.List;

public interface AdminService {
    List<UserDto> getAllUsers();
    DepartmentDto createDepartment(DepartmentDto departmentDto);
}