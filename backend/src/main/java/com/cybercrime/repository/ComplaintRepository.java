package com.cybercrime.repository;

import com.cybercrime.model.Complaint;
import com.cybercrime.model.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    // Basic queries
    List<Complaint> findByUserId(Long userId);
    List<Complaint> findByDepartmentId(Long departmentId);
    
    // Feedback related queries
    List<Complaint> findByUserIdAndFeedbackNotNull(Long userId);
    List<Complaint> findByDepartmentIdAndFeedbackNotNull(Long departmentId);
    
    // Status related queries
    List<Complaint> findByStatus(ComplaintStatus status);
    List<Complaint> findByDepartmentIdAndStatus(Long departmentId, ComplaintStatus status);
    
    // Statistics queries
    @Query("SELECT AVG(c.rating) FROM Complaint c WHERE c.department.id = :departmentId AND c.rating IS NOT NULL")
    Optional<Double> getAverageDepartmentRating(@Param("departmentId") Long departmentId);
    
    @Query("SELECT c FROM Complaint c WHERE c.department.id = :departmentId AND c.feedback IS NOT NULL ORDER BY c.feedbackDate DESC")
    List<Complaint> findLatestFeedbacksByDepartment(@Param("departmentId") Long departmentId);
    
    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.department.id = :departmentId AND c.status = :status")
    Long countByDepartmentAndStatus(@Param("departmentId") Long departmentId, @Param("status") ComplaintStatus status);
    
    @Query("SELECT c FROM Complaint c JOIN FETCH c.evidences WHERE c.id = :id")
    Optional<Complaint> findByIdWithEvidences(@Param("id") Long id);
    
    Long countByStatus(ComplaintStatus status);
}