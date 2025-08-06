package com.cybercrime.mapper;

import com.cybercrime.dto.*;
import com.cybercrime.model.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EntityMapper {
    
    UserDto toUserDto(User user);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "approved", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User toUser(RegisterUserDto registerUserDto);
    
    ComplaintDto toComplaintDto(Complaint complaint);
    Complaint toComplaint(ComplaintDto complaintDto);
    
    DepartmentDto toDepartmentDto(Department department);
    Department toDepartment(DepartmentDto departmentDto);
    
    EvidenceDto toEvidenceDto(Evidence evidence);
    Evidence toEvidence(EvidenceDto evidenceDto);
}