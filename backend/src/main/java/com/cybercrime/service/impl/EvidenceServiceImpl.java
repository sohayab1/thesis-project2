package com.cybercrime.service.impl;

import com.cybercrime.dto.EvidenceDto;
import com.cybercrime.model.Evidence;
import com.cybercrime.model.Complaint;
import com.cybercrime.repository.EvidenceRepository;
import com.cybercrime.repository.ComplaintRepository;
import com.cybercrime.service.EvidenceService;
import com.cybercrime.service.FileStorageService;
import com.cybercrime.mapper.EntityMapperService;
import com.cybercrime.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EvidenceServiceImpl implements EvidenceService {
    private final EvidenceRepository evidenceRepository;
    private final ComplaintRepository complaintRepository;
    private final FileStorageService fileStorageService;
    private final EntityMapperService mapper;

    @Override
    @Transactional
    public EvidenceDto uploadEvidence(Long complaintId, MultipartFile file, String uploadedBy) {
        Complaint complaint = complaintRepository.findById(complaintId)
            .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        String filePath = fileStorageService.store(file, "evidences");

        Evidence evidence = new Evidence();
        evidence.setComplaint(complaint);
        evidence.setFilename(file.getOriginalFilename());
        evidence.setFileType(file.getContentType());
        evidence.setFilePath(filePath);
        evidence.setFileSize(file.getSize());
        evidence.setUploadedBy(uploadedBy);
        evidence.setUploadedAt(LocalDateTime.now());

        return mapper.toEvidenceDto(evidenceRepository.save(evidence));
    }

    @Override
    public EvidenceDto getEvidence(Long id) {
        return mapper.toEvidenceDto(findEvidenceById(id));
    }

    @Override
    public List<EvidenceDto> getEvidencesByComplaint(Long complaintId) {
        return evidenceRepository.findByComplaintId(complaintId).stream()
            .map(mapper::toEvidenceDto)
            .toList();
    }

    @Override
    @Transactional
    public void deleteEvidence(Long id) {
        Evidence evidence = findEvidenceById(id);
        fileStorageService.delete(evidence.getFilePath());
        evidenceRepository.delete(evidence);
    }

    @Override
    public byte[] downloadEvidence(Long id) {
        Evidence evidence = findEvidenceById(id);
        return fileStorageService.load(evidence.getFilePath());
    }

    private Evidence findEvidenceById(Long id) {
        return evidenceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Evidence not found"));
    }
}