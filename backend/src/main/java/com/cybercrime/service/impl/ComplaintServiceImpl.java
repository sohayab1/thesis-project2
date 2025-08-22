package com.cybercrime.service.impl;

import com.cybercrime.dto.*;
import com.cybercrime.model.*;
import com.cybercrime.repository.*;
import com.cybercrime.service.*;
import com.cybercrime.mapper.EntityMapperService;
import com.cybercrime.exception.ResourceNotFoundException;
import com.cybercrime.exception.InvalidOperationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import jakarta.annotation.PostConstruct;
import java.util.List;
import java.time.LocalDateTime;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ComplaintServiceImpl implements ComplaintService {
    private final ComplaintRepository complaintRepository;
    private final EvidenceRepository evidenceRepository;
    private final DepartmentRepository departmentRepository;
    private final FileStorageService fileStorageService;
    private final EntityMapperService entityMapper; // Change from mapper to entityMapper
    private final UserRepository userRepository;

    @PostConstruct
    public void init() {
        try {
            List<String> existingStatuses = complaintRepository.findAllDistinctStatuses();
            for (String status : existingStatuses) {
                try {
                    ComplaintStatus.valueOf(status);
                } catch (IllegalArgumentException e) {
                    // If status is invalid, update it to SUBMITTED
                    log.warn("Found invalid status: {}. Updating to SUBMITTED", status);
                    complaintRepository.updateComplaintStatus(status, ComplaintStatus.SUBMITTED);
                }
            }
        } catch (Exception e) {
            log.error("Error during complaint status initialization", e);
        }
    }

    @Override
    public ComplaintDto createComplaint(ComplaintCreateDto complaintDto, List<MultipartFile> evidences, Long userId) {
        Complaint complaint = entityMapper.toComplaint(complaintDto);
        complaint.setCreatedAt(LocalDateTime.now());
        complaint.setStatus(ComplaintStatus.SUBMITTED); // CORRECT
        complaint.setPriority(ComplaintPriority.MEDIUM); // Use setPriority instead of setAdminSetPriority
        
        // Set new fields
        complaint.setSuspectInfo(complaintDto.getSuspectInfo());
        complaint.setSuspectSocialMedia(complaintDto.getSuspectSocialMedia());
        complaint.setSuspectPhoneNumber(complaintDto.getSuspectPhoneNumber());
        
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

        return entityMapper.toComplaintDto(savedComplaint);
    }

    @Override
    @Transactional
    public ComplaintDto updateStatus(Long complaintId, ComplaintStatusUpdateDto statusUpdate) {
        Complaint complaint = complaintRepository.findById(complaintId)
            .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
            
        validateStatusTransition(complaint.getStatus(), statusUpdate.getStatus());
        complaint.setStatus(statusUpdate.getStatus());
        
        return entityMapper.toComplaintDto(complaintRepository.save(complaint));
    }

    @Override
    @Transactional
    public ComplaintDto addFeedback(Long complaintId, FeedbackDto feedbackDto) {
        Complaint complaint = complaintRepository.findById(complaintId)
            .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        
        // Check if feedback already exists
        if (complaint.getFeedback() != null) {
            throw new IllegalStateException("Feedback already exists for this complaint");
        }
        
        // Add feedback only if complaint is resolved
        if (complaint.getStatus() != ComplaintStatus.RESOLVED) {
            throw new IllegalStateException("Can only add feedback to resolved complaints");
        }
        
        complaint.setFeedback(feedbackDto.getComment());
        complaint.setRating(feedbackDto.getRating());
        complaint.setFeedbackDate(LocalDateTime.now());
        
        return entityMapper.toComplaintDto(complaintRepository.save(complaint));
    }

    @Override
    public List<ComplaintDto> getUserComplaints(Long userId) {
        log.debug("Getting complaints for user: {}", userId);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            
        List<Complaint> complaints = complaintRepository.findByUserId(userId);
        return complaints.stream()
            .map(entityMapper::toComplaintDto)
            .collect(Collectors.toList());
    }

    @Override
    public ComplaintDto getComplaint(Long id) {
        return entityMapper.toComplaintDto(complaintRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Complaint not found")));
    }

    @Override
    public List<ComplaintDto> getComplaintsByDepartment(Long departmentId) {
        List<Complaint> complaints = complaintRepository.findByDepartmentId(departmentId);
        return complaints.stream()
            .map(entityMapper::toComplaintDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<ComplaintDto> getAllComplaints() {
        List<Complaint> complaints = complaintRepository.findAll();
        return complaints.stream()
            .map(entityMapper::toComplaintDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteComplaint(Long id) {
        if (!complaintRepository.existsById(id)) {
            throw new ResourceNotFoundException("Complaint not found");
        }
        complaintRepository.deleteById(id);
    }

    @Override
    @Transactional
    public ComplaintDto resolveComplaint(Long complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
            .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        
        complaint.setStatus(ComplaintStatus.RESOLVED);
        complaint.setResolvedDate(LocalDateTime.now());
        
        return entityMapper.toComplaintDto(complaintRepository.save(complaint));
    }

    @Override
    public ComplaintDto updateComplaint(Long id, ComplaintCreateDto complaintDto) {
        Complaint existingComplaint = complaintRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        // Only allow editing if complaint is not yet resolved
        if (existingComplaint.getStatus() == ComplaintStatus.RESOLVED || 
            existingComplaint.getStatus() == ComplaintStatus.UNRESOLVED) {
            throw new InvalidOperationException("Cannot edit resolved complaints");
        }

        // Update fields
        existingComplaint.setTitle(complaintDto.getTitle());
        existingComplaint.setDescription(complaintDto.getDescription());
        existingComplaint.setLocation(complaintDto.getLocation());
        existingComplaint.setIncidentDate(complaintDto.getIncidentDate());
        existingComplaint.setSuspectInfo(complaintDto.getSuspectInfo());
        existingComplaint.setSuspectSocialMedia(complaintDto.getSuspectSocialMedia());
        existingComplaint.setSuspectPhoneNumber(complaintDto.getSuspectPhoneNumber());

        return entityMapper.toComplaintDto(complaintRepository.save(existingComplaint));
    }

    @Override
    public ComplaintDto processComplaint(Long id, ComplaintStatusUpdateDto statusUpdate) {
        Complaint complaint = complaintRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        // Validate status transition
        validateStatusTransition(complaint.getStatus(), statusUpdate.getStatus());
        
        complaint.setStatus(statusUpdate.getStatus());
        
        if (statusUpdate.getStatus() == ComplaintStatus.RESOLVED || 
            statusUpdate.getStatus() == ComplaintStatus.UNRESOLVED) {
            complaint.setResolvedDate(LocalDateTime.now());
        }

        return entityMapper.toComplaintDto(complaintRepository.save(complaint));
    }

    private void validateStatusTransition(ComplaintStatus currentStatus, ComplaintStatus newStatus) {
        // Define valid transitions
        Map<ComplaintStatus, Set<ComplaintStatus>> validTransitions = Map.of(
            ComplaintStatus.SUBMITTED, Set.of(ComplaintStatus.APPROVAL_PENDING),
            ComplaintStatus.APPROVAL_PENDING, Set.of(ComplaintStatus.ENQUIRY_ONGOING),
            ComplaintStatus.ENQUIRY_ONGOING, Set.of(ComplaintStatus.RESOLVED, ComplaintStatus.UNRESOLVED)
        );

        if (!validTransitions.containsKey(currentStatus) || 
            !validTransitions.get(currentStatus).contains(newStatus)) {
            throw new InvalidOperationException(
                String.format("Invalid status transition from %s to %s", currentStatus, newStatus)
            );
        }
    }

    private Evidence createEvidence(MultipartFile file, Complaint complaint) {
        String filePath = fileStorageService.store(file, "evidences");
        Evidence evidence = new Evidence();
        evidence.setFilename(file.getOriginalFilename());
        evidence.setFileType(file.getContentType());
        evidence.setFilePath(filePath);
        evidence.setComplaint(complaint);
        return evidence;
    }
}