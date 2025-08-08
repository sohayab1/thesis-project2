package com.cybercrime.mapper;

import com.cybercrime.dto.*;
import com.cybercrime.model.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EntityMapperService {
    private final ModelMapper modelMapper;

    // User mappings
    public UserDto toUserDto(User user) {
        UserDto dto = modelMapper.map(user, UserDto.class);
        if (user.getDepartment() != null) {
            dto.setDepartmentId(user.getDepartment().getId());
        }
        return dto;
    }

    public User toUser(RegisterUserDto registerUserDto) {
        return modelMapper.map(registerUserDto, User.class);
    }

    public User toUser(UserUpdateDto userUpdateDto) {
        return modelMapper.map(userUpdateDto, User.class);
    }

    // Complaint mappings
    public ComplaintDto toComplaintDto(Complaint complaint) {
        return modelMapper.map(complaint, ComplaintDto.class);
    }

    public Complaint toComplaint(ComplaintCreateDto complaintCreateDto) {
        return modelMapper.map(complaintCreateDto, Complaint.class);
    }

    // Department mappings
    public DepartmentDto toDepartmentDto(Department department) {
        DepartmentDto dto = modelMapper.map(department, DepartmentDto.class);
        dto.setComplaintCount(department.getComplaints().size());
        return dto;
    }

    public Department toDepartment(DepartmentDto departmentDto) {
        return modelMapper.map(departmentDto, Department.class);
    }

    // Evidence mappings
    public EvidenceDto toEvidenceDto(Evidence evidence) {
        return modelMapper.map(evidence, EvidenceDto.class);
    }

    public Evidence toEvidence(EvidenceDto evidenceDto) {
        return modelMapper.map(evidenceDto, Evidence.class);
    }

    // Feedback mappings
    public FeedbackDto toFeedbackDto(Complaint complaint) {
        FeedbackDto dto = new FeedbackDto();
        dto.setComplaintId(complaint.getId());
        dto.setFeedback(complaint.getFeedback());
        dto.setRating(complaint.getRating());
        return dto;
    }

    // List mappings
    public <S, T> List<T> mapList(List<S> source, Class<T> targetClass) {
        return source.stream()
            .map(element -> modelMapper.map(element, targetClass))
            .collect(Collectors.toList());
    }
}