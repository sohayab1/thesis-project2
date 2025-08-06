package com.cybercrime.service.impl;

import com.cybercrime.dto.DepartmentDto;
import com.cybercrime.dto.ComplaintDto;
import com.cybercrime.model.Department;
import com.cybercrime.repository.DepartmentRepository;
import com.cybercrime.repository.ComplaintRepository;
import com.cybercrime.service.DepartmentService;
import com.cybercrime.mapper.EntityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final ComplaintRepository complaintRepository;
    private final EntityMapper entityMapper;

    @Override
    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(entityMapper::toDepartmentDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ComplaintDto> getDepartmentComplaints(Long departmentId) {
        return complaintRepository.findByDepartmentId(departmentId).stream()
                .map(entityMapper::toComplaintDto)
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentDto getDepartment(Long id) {
        Department department = departmentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        return entityMapper.toDepartmentDto(department);
    }
}