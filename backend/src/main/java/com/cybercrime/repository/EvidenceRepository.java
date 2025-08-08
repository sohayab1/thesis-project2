package com.cybercrime.repository;

import com.cybercrime.model.Evidence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface EvidenceRepository extends JpaRepository<Evidence, Long> {
    List<Evidence> findByComplaintId(Long complaintId);
    
    @Query("SELECT e FROM Evidence e WHERE e.complaint.id = :complaintId AND e.fileType LIKE 'image%'")
    List<Evidence> findImagesByComplaintId(Long complaintId);
    
    void deleteByComplaintId(Long complaintId);
}