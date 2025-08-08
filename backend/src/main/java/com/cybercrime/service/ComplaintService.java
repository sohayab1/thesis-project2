package com.cybercrime.service;

import com.cybercrime.dto.*;
import com.cybercrime.model.ComplaintStatus;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface ComplaintService {
    ComplaintDto createComplaint(ComplaintCreateDto complaintDto, List<MultipartFile> evidences);
    ComplaintDto updateStatus(Long complaintId, ComplaintStatus status);
    ComplaintDto addFeedback(Long complaintId, String feedback, Integer rating);
    List<ComplaintDto> getUserComplaints(Long userId);
    ComplaintDto getComplaint(Long id);
    List<ComplaintDto> getComplaintsByDepartment(Long departmentId);
    List<ComplaintDto> getAllComplaints();
}