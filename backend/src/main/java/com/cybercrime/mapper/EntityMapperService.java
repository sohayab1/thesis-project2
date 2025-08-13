package com.cybercrime.mapper;

import com.cybercrime.dto.*;
import com.cybercrime.model.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EntityMapperService {
    // User mappings
    public UserDto toUserDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setNidNumber(user.getNidNumber());
        dto.setRole(user.getRole());  // Changed: directly pass the UserRole enum
        dto.setApproved(user.isApproved());
        if (user.getDepartment() != null) {
            dto.setDepartmentId(user.getDepartment().getId());
        }
        return dto;
    }

    public User toUser(RegisterUserDto registerUserDto) {
        User user = new User();
        user.setName(registerUserDto.getName());
        user.setEmail(registerUserDto.getEmail());
        user.setNidNumber(registerUserDto.getNidNumber());
        user.setPassword(registerUserDto.getPassword());
        user.setRole(UserRole.USER);  // Use enum instead of string
        user.setApproved(false);
        return user;
    }

    public User toUser(UserUpdateDto userUpdateDto) {
        User user = new User();
        user.setId(userUpdateDto.getId());
        user.setName(userUpdateDto.getName());
        user.setEmail(userUpdateDto.getEmail());
        user.setNidNumber(userUpdateDto.getNidNumber());
        return user;
    }

    // Complaint mappings
    public ComplaintDto toComplaintDto(Complaint complaint) {
        ComplaintDto dto = new ComplaintDto();
        dto.setId(complaint.getId());
        dto.setTitle(complaint.getTitle());
        dto.setDescription(complaint.getDescription());
        dto.setStatus(complaint.getStatus().name());  // Convert enum to string
        dto.setCreatedAt(complaint.getCreatedAt());
        dto.setLocation(complaint.getLocation());
        dto.setIncidentDate(complaint.getIncidentDate());
        dto.setPriority(complaint.getPriority().name());  // Convert enum to string
        
        if (complaint.getUser() != null) {
            dto.setUser(toUserDto(complaint.getUser()));
        }
        
        if (complaint.getDepartment() != null) {
            dto.setDepartment(toDepartmentDto(complaint.getDepartment()));
        }
        
        return dto;
    }

    public Complaint toComplaint(ComplaintCreateDto complaintCreateDto) {
        Complaint complaint = new Complaint();
        complaint.setTitle(complaintCreateDto.getTitle());
        complaint.setDescription(complaintCreateDto.getDescription());
        complaint.setLocation(complaintCreateDto.getLocation());
        complaint.setIncidentDate(complaintCreateDto.getIncidentDate());
        // Changed: convert string to enum directly
        complaint.setPriority(Complaint.ComplaintPriority.valueOf(complaintCreateDto.getPriority()));
        complaint.setStatus(ComplaintStatus.PENDING);
        complaint.setCreatedAt(LocalDateTime.now());
        return complaint;
    }

    // Department mappings
    public DepartmentDto toDepartmentDto(Department department) {
        DepartmentDto dto = new DepartmentDto();
        dto.setId(department.getId());
        dto.setName(department.getName());
        dto.setDescription(department.getDescription());
        dto.setComplaintCount(department.getComplaints().size());
        return dto;
    }

    public Department toDepartment(DepartmentDto departmentDto) {
        Department department = new Department();
        department.setId(departmentDto.getId());
        department.setName(departmentDto.getName());
        department.setDescription(departmentDto.getDescription());
        return department;
    }

    // Evidence mappings
    public EvidenceDto toEvidenceDto(Evidence evidence) {
        EvidenceDto dto = new EvidenceDto();
        dto.setId(evidence.getId());
        dto.setComplaintId(evidence.getComplaint().getId());
        dto.setFilePath(evidence.getFilePath());
        dto.setFileType(evidence.getFileType());
        return dto;
    }

    public Evidence toEvidence(EvidenceDto evidenceDto) {
        Evidence evidence = new Evidence();
        evidence.setId(evidenceDto.getId());
        evidence.setFilePath(evidenceDto.getFilePath());
        evidence.setFileType(evidenceDto.getFileType());
        return evidence;
    }

    // Feedback mappings
    public FeedbackDto toFeedbackDto(Complaint complaint) {
        FeedbackDto dto = new FeedbackDto();
        dto.setId(complaint.getId());
        dto.setRating(complaint.getRating());
        dto.setComment(complaint.getFeedback());
        dto.setCreatedAt(complaint.getFeedbackDate());
        dto.setComplaintId(complaint.getId());
        dto.setUserId(complaint.getUser().getId());
        return dto;
    }

    // List mappings
    public <S, T> List<T> mapList(List<S> source, Class<T> targetClass) {
        return source.stream()
            .map(element -> {
                if (targetClass == UserDto.class) {
                    return (T) toUserDto((User) element);
                } else if (targetClass == ComplaintDto.class) {
                    return (T) toComplaintDto((Complaint) element);
                } else if (targetClass == DepartmentDto.class) {
                    return (T) toDepartmentDto((Department) element);
                } else if (targetClass == EvidenceDto.class) {
                    return (T) toEvidenceDto((Evidence) element);
                } else if (targetClass == FeedbackDto.class) {
                    return (T) toFeedbackDto((Complaint) element);
                }
                return null;
            })
            .collect(Collectors.toList());
    }
}