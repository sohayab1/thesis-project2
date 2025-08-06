package com.cybercrime.service.impl;

import com.cybercrime.dto.DepartmentDto;
import com.cybercrime.dto.UserDto;
import com.cybercrime.model.Department;
import com.cybercrime.repository.DepartmentRepository;
import com.cybercrime.repository.UserRepository;
import com.cybercrime.service.AdminService;
import com.cybercrime.mapper.EntityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final EntityMapper entityMapper;

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(entityMapper::toUserDto)
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentDto createDepartment(DepartmentDto departmentDto) {
        Department department = entityMapper.toDepartment(departmentDto);
        department = departmentRepository.save(department);
        return entityMapper.toDepartmentDto(department);
    }
}