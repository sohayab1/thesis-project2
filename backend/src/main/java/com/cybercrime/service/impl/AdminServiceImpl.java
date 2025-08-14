package com.cybercrime.service.impl;

import com.cybercrime.dto.ComplaintDto;
import com.cybercrime.dto.DepartmentDto;
import com.cybercrime.dto.UserDto;
import com.cybercrime.exception.ResourceNotFoundException;
import com.cybercrime.model.Complaint;
import com.cybercrime.model.ComplaintStatus;
import com.cybercrime.model.Department;
import com.cybercrime.model.User;
import com.cybercrime.repository.ComplaintRepository;
import com.cybercrime.repository.DepartmentRepository;
import com.cybercrime.repository.UserRepository;
import com.cybercrime.service.AdminService;
import com.cybercrime.mapper.EntityMapperService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AdminServiceImpl implements AdminService {
    private final ComplaintRepository complaintRepository;
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
    public UserDto approveUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setApproved(true);
        return mapper.toUserDto(userRepository.save(user));
    }

    @Override
    public UserDto rejectUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setApproved(false);
        return mapper.toUserDto(userRepository.save(user));
    }

    @Override
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
    public void deleteDepartment(Long departmentId) {
        if (!departmentRepository.existsById(departmentId)) {
            throw new ResourceNotFoundException("Department not found");
        }
        departmentRepository.deleteById(departmentId);
    }

    @Override
    public DepartmentDto updateDepartment(Long departmentId, DepartmentDto departmentDto) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        
        department.setName(departmentDto.getName());
        department.setDescription(departmentDto.getDescription());
        department.setActive(departmentDto.isActive());
        
        return mapper.toDepartmentDto(departmentRepository.save(department));
    }

    @Override
    public List<ComplaintDto> getAllComplaints() {
        try {
            List<Complaint> complaints = complaintRepository.findAllWithUserAndDepartment();
            return complaints.stream()
                .map(complaint -> {
                    ComplaintDto dto = new ComplaintDto();
                    dto.setId(complaint.getId());
                    dto.setTitle(complaint.getTitle());
                    dto.setDescription(complaint.getDescription());
                    dto.setStatus(complaint.getStatus() != null ? complaint.getStatus().name() : "PENDING");
                    dto.setCreatedAt(complaint.getCreatedAt());
                    // Handle null priority safely
                    dto.setPriority(complaint.getPriority() != null ? 
                        complaint.getPriority().name() : "MEDIUM");
                    
                    if (complaint.getUser() != null) {
                        dto.setUser(mapper.toUserDto(complaint.getUser()));
                    }
                    
                    if (complaint.getDepartment() != null) {
                        dto.setDepartment(mapper.toDepartmentDto(complaint.getDepartment()));
                    }
                    
                    return dto;
                })
                .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching complaints: ", e);
            throw new RuntimeException("Failed to fetch complaints", e);
        }
    }

    @Override
    public Map<String, Object> getComplaintStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", complaintRepository.count());
        stats.put("pending", complaintRepository.countByStatus(ComplaintStatus.PENDING));
        stats.put("inProgress", complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS));
        stats.put("resolved", complaintRepository.countByStatus(ComplaintStatus.RESOLVED));
        return stats;
    }

    @Override
    public ComplaintDto resolveComplaint(Long complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
            .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        complaint.setStatus(ComplaintStatus.RESOLVED);
        complaint.setResolvedDate(LocalDateTime.now());
        return mapper.toComplaintDto(complaintRepository.save(complaint));
    }

    @Override
    public ComplaintDto assignDepartment(Long complaintId, Long departmentId) {
        Complaint complaint = complaintRepository.findById(complaintId)
            .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        Department department = departmentRepository.findById(departmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        complaint.setDepartment(department);
        return mapper.toComplaintDto(complaintRepository.save(complaint));
    }
}