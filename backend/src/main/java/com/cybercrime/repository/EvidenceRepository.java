package main.java.com.cybercrime.repository;

import com.cybercrime.model.Evidence;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EvidenceRepository extends JpaRepository<Evidence, Long> {
    List<Evidence> findByComplaintId(Long complaintId);
}