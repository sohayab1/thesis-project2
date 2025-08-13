package com.cybercrime.service;

import com.cybercrime.dto.*;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface ComplaintService {
    ComplaintDto createComplaint(ComplaintCreateDto complaintDto, List<MultipartFile> evidences, Long userId);
    ComplaintDto updateStatus(Long complaintId, ComplaintStatusUpdateDto statusUpdate);
    ComplaintDto addFeedback(Long complaintId, FeedbackDto feedbackDto);
    List<ComplaintDto> getUserComplaints(Long userId);
    ComplaintDto getComplaint(Long id);
    List<ComplaintDto> getComplaintsByDepartment(Long departmentId);
    List<ComplaintDto> getAllComplaints();
    void deleteComplaint(Long id);
}