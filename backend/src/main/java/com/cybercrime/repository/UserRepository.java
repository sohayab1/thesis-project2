package com.cybercrime.repository;

import com.cybercrime.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByNidNumber(String nidNumber);
    List<User> findByDepartmentId(Long departmentId);
    List<User> findByApproved(boolean approved);
    
    @Query("SELECT u FROM User u WHERE u.role = 'DEPARTMENT_ADMIN'")
    List<User> findAllDepartmentAdmins();
    
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.email = :email AND u.id != :userId")
    boolean existsByEmailAndIdNot(String email, Long userId);
}