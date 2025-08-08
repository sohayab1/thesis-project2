package com.cybercrime.service;

import com.cybercrime.dto.EvidenceDto;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface EvidenceService {
    EvidenceDto uploadEvidence(Long complaintId, MultipartFile file, String uploadedBy);
    EvidenceDto getEvidence(Long id);
    List<EvidenceDto> getEvidencesByComplaint(Long complaintId);
    void deleteEvidence(Long id);
    byte[] downloadEvidence(Long id);
}