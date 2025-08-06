package com.cybercrime.repository;

import com.cybercrime.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByUserId(Long userId);
    List<Complaint> findByDepartmentId(Long departmentId);
    List<Complaint> findByStatus(ComplaintStatus status);
}