package com.cybercrime.service.impl;

import com.cybercrime.dto.*;
import com.cybercrime.model.*;
import com.cybercrime.repository.*;
import com.cybercrime.service.DepartmentService;
import com.cybercrime.mapper.EntityMapperService;
import com.cybercrime.exception.ResourceNotFoundException;
import com.cybercrime.exception.DuplicateResourceException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final EntityMapperService mapper;

    @Override
    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(mapper::toDepartmentDto)
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentDto getDepartment(Long id) {
        return mapper.toDepartmentDto(findDepartmentById(id));
    }

    @Override
    @Transactional
    public DepartmentDto createDepartment(DepartmentDto departmentDto) {
        if (departmentRepository.existsByName(departmentDto.getName())) {
            throw new DuplicateResourceException("Department with this name already exists");
        }
        Department department = mapper.toDepartment(departmentDto);
        department.setActive(true);
        return mapper.toDepartmentDto(departmentRepository.save(department));
    }

    @Override
    @Transactional
    public DepartmentDto updateDepartment(Long id, DepartmentUpdateDto updateDto) {
        Department department = findDepartmentById(id);
        
        if (!department.getName().equals(updateDto.getName()) && 
            departmentRepository.existsByName(updateDto.getName())) {
            throw new DuplicateResourceException("Department with this name already exists");
        }

        department.setName(updateDto.getName());
        department.setDescription(updateDto.getDescription());
        department.setActive(updateDto.isActive());

        if (updateDto.getDepartmentAdminIds() != null) {
            List<User> admins = userRepository.findAllById(updateDto.getDepartmentAdminIds());
            department.setDepartmentAdmins(admins);
        }

        return mapper.toDepartmentDto(departmentRepository.save(department));
    }

    @Override
    @Transactional
    public void deleteDepartment(Long id) {
        Department department = findDepartmentById(id);
        if (!department.getComplaints().isEmpty()) {
            throw new IllegalStateException("Cannot delete department with existing complaints");
        }
        departmentRepository.delete(department);
    }

    @Override
    public List<ComplaintDto> getDepartmentComplaints(Long departmentId) {
        findDepartmentById(departmentId); // Verify department exists
        return complaintRepository.findByDepartmentId(departmentId).stream()
                .map(mapper::toComplaintDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDto> getDepartmentAdmins(Long departmentId) {
        Department department = findDepartmentById(departmentId);
        return department.getDepartmentAdmins().stream()
                .map(mapper::toUserDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DepartmentDto addDepartmentAdmin(Long departmentId, Long userId) {
        Department department = findDepartmentById(departmentId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (!department.getDepartmentAdmins().contains(user)) {
            department.getDepartmentAdmins().add(user);
            user.setRole(UserRole.DEPARTMENT_ADMIN);  // Now using the correct enum value
            userRepository.save(user);
        }
        
        return mapper.toDepartmentDto(departmentRepository.save(department));
    }

    @Override
    @Transactional
    public DepartmentDto removeDepartmentAdmin(Long departmentId, Long userId) {
        Department department = findDepartmentById(departmentId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (department.getDepartmentAdmins().remove(user)) {
            user.setRole(UserRole.USER);
            userRepository.save(user);
        }
        
        return mapper.toDepartmentDto(departmentRepository.save(department));
    }

    private Department findDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
    }
}