package com.cybercrime.service.impl;

import com.cybercrime.dto.*;
import com.cybercrime.model.*;
import com.cybercrime.repository.*;
import com.cybercrime.service.*;
import com.cybercrime.mapper.EntityMapperService;
import com.cybercrime.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ComplaintServiceImpl implements ComplaintService {
    private final ComplaintRepository complaintRepository;
    private final EvidenceRepository evidenceRepository;
    private final DepartmentRepository departmentRepository;
    private final FileStorageService fileStorageService;
    private final EntityMapperService mapper;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ComplaintDto createComplaint(ComplaintCreateDto complaintDto, List<MultipartFile> evidences, Long userId) {
        Complaint complaint = mapper.toComplaint(complaintDto);
        complaint.setCreatedAt(LocalDateTime.now());
        complaint.setStatus(ComplaintStatus.PENDING);
        
        Department department = departmentRepository.findById(complaintDto.getDepartmentId())
            .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        complaint.setDepartment(department);
        
        // Set the user
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        complaint.setUser(user);
        
        Complaint savedComplaint = complaintRepository.save(complaint);

        if (evidences != null && !evidences.isEmpty()) {
            List<Evidence> evidenceList = evidences.stream()
                .map(file -> createEvidence(file, savedComplaint))
                .toList();
            evidenceRepository.saveAll(evidenceList);
            savedComplaint.setEvidences(evidenceList);
        }

        return mapper.toComplaintDto(savedComplaint);
    }

    @Override
    @Transactional
    public ComplaintDto updateStatus(Long complaintId, ComplaintStatusUpdateDto statusUpdate) {
        Complaint complaint = complaintRepository.findById(complaintId)
            .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        
        complaint.setStatus(statusUpdate.getStatus());
        complaint.setResolutionNotes(statusUpdate.getComment());
        
        if (statusUpdate.getStatus() == ComplaintStatus.RESOLVED) {
            complaint.setResolvedDate(LocalDateTime.now());
        }
        
        return mapper.toComplaintDto(complaintRepository.save(complaint));
    }

    @Override
    @Transactional
    public ComplaintDto addFeedback(Long complaintId, FeedbackDto feedbackDto) {
        Complaint complaint = complaintRepository.findById(complaintId)
            .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        
        complaint.setFeedback(feedbackDto.getComment());
        complaint.setRating(feedbackDto.getRating());
        complaint.setFeedbackDate(LocalDateTime.now());
        
        return mapper.toComplaintDto(complaintRepository.save(complaint));
    }

    @Override
    public List<ComplaintDto> getUserComplaints(Long userId) {
        return complaintRepository.findByUserId(userId).stream()
            .map(mapper::toComplaintDto)
            .toList();
    }

    @Override
    public ComplaintDto getComplaint(Long id) {
        return mapper.toComplaintDto(complaintRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Complaint not found")));
    }

    @Override
    public List<ComplaintDto> getComplaintsByDepartment(Long departmentId) {
        return complaintRepository.findByDepartmentId(departmentId).stream()
            .map(mapper::toComplaintDto)
            .toList();
    }

    @Override
    public List<ComplaintDto> getAllComplaints() {
        return complaintRepository.findAll().stream()
            .map(mapper::toComplaintDto)
            .toList();
    }

    @Override
    @Transactional
    public void deleteComplaint(Long id) {
        if (!complaintRepository.existsById(id)) {
            throw new ResourceNotFoundException("Complaint not found");
        }
        complaintRepository.deleteById(id);
    }

    private Evidence createEvidence(MultipartFile file, Complaint complaint) {
        String filePath = fileStorageService.store(file, "evidences");
        Evidence evidence = new Evidence();
        evidence.setComplaint(complaint);
        evidence.setFilename(file.getOriginalFilename());
        evidence.setFileType(file.getContentType());
        evidence.setFilePath(filePath);
        return evidence;
    }
}