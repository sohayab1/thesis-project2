package com.cybercrime.service.impl;

import com.cybercrime.dto.ComplaintDto;
import com.cybercrime.dto.ComplaintCreateDto;
import com.cybercrime.model.Complaint;
import com.cybercrime.repository.ComplaintRepository;
import com.cybercrime.service.ComplaintService;
import com.cybercrime.service.FileStorageService;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ComplaintServiceImpl implements ComplaintService {
    private final ComplaintRepository complaintRepository;
    private final EvidenceRepository evidenceRepository;
    private final FileStorageService fileStorageService;

    @Override
    public ComplaintDto createComplaint(ComplaintCreateDto complaintDto, List<MultipartFile> evidences) {
        Complaint complaint = new Complaint();
        // set complaint properties from complaintDto
        Complaint savedComplaint = complaintRepository.save(complaint);

        if (evidences != null) {
            evidences.forEach(file -> {
                Evidence evidence = new Evidence();
                evidence.setComplaint(savedComplaint);
                evidence.setFilename(file.getOriginalFilename());
                evidence.setFileType(file.getContentType());
                evidence.setFilePath(fileStorageService.store(file, "evidences"));
                evidenceRepository.save(evidence);
            });
        }

        return mapToDto(savedComplaint);
    }

    @Override
    public ComplaintDto updateStatus(Long complaintId, ComplaintStatus status) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        complaint.setStatus(status);
        return mapToDto(complaintRepository.save(complaint));
    }

    @Override
    public ComplaintDto addFeedback(Long complaintId, String feedback, Integer rating) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        complaint.setFeedback(feedback);
        complaint.setRating(rating);
        return mapToDto(complaintRepository.save(complaint));
    }

    @Override
    public List<ComplaintDto> getUserComplaints(Long userId) {
        // implementation
    }

    @Override
    public ComplaintDto getComplaint(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        return mapToDto(complaint);
    }

    private ComplaintDto mapToDto(Complaint complaint) {
        ComplaintDto dto = new ComplaintDto();
        // map properties from complaint to dto
        return dto;
    }
}