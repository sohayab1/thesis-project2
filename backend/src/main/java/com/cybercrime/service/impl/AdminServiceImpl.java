package com.cybercrime.service.impl;

import com.cybercrime.dto.DepartmentDto;
import com.cybercrime.dto.UserDto;
import com.cybercrime.exception.ResourceNotFoundException;
import com.cybercrime.model.Department;
import com.cybercrime.model.User;
import com.cybercrime.repository.DepartmentRepository;
import com.cybercrime.repository.UserRepository;
import com.cybercrime.service.AdminService;
import com.cybercrime.mapper.EntityMapperService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final EntityMapperService mapper;

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(mapper::toUserDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDto> getPendingUsers() {
        return userRepository.findByApproved(false).stream()
                .map(mapper::toUserDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserDto approveUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setApproved(true);
        return mapper.toUserDto(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserDto rejectUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        userRepository.delete(user);
        return mapper.toUserDto(user);
    }

    @Override
    @Transactional
    public DepartmentDto createDepartment(DepartmentDto departmentDto) {
        Department department = mapper.toDepartment(departmentDto);
        department = departmentRepository.save(department);
        return mapper.toDepartmentDto(department);
    }

    @Override
    public List<UserDto> getUsersByDepartment(Long departmentId) {
        return userRepository.findByDepartmentId(departmentId).stream()
                .map(mapper::toUserDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteDepartment(Long departmentId) {
        if (!departmentRepository.existsById(departmentId)) {
            throw new ResourceNotFoundException("Department not found");
        }
        departmentRepository.deleteById(departmentId);
    }

    @Override
    @Transactional
    public DepartmentDto updateDepartment(Long departmentId, DepartmentDto departmentDto) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        
        department.setName(departmentDto.getName());
        department.setDescription(departmentDto.getDescription());
        department.setActive(departmentDto.isActive());
        
        return mapper.toDepartmentDto(departmentRepository.save(department));
    }
}