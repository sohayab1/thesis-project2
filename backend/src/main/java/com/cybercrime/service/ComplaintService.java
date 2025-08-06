package main.java.com.cybercrime.service;
import com.cybercrime.model.Complaint;
import com.cybercrime.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplaintService {
    private final ComplaintRepository complaintRepository;
    private final EvidenceRepository evidenceRepository;
    private final FileStorageService fileStorageService;

    public Complaint createComplaint(Complaint complaint, List<MultipartFile> evidences) {
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

        return savedComplaint;
    }

    public Complaint updateStatus(Long complaintId, ComplaintStatus status) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        complaint.setStatus(status);
        return complaintRepository.save(complaint);
    }

    public Complaint addFeedback(Long complaintId, String feedback, Integer rating) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        complaint.setFeedback(feedback);
        complaint.setRating(rating);
        return complaintRepository.save(complaint);
    }
}