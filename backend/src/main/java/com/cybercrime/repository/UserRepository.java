package com.cybercrime.repository;

import com.cybercrime.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByNidNumber(String nidNumber);
    List<User> findByDepartmentId(Long departmentId);
    List<User> findByApproved(boolean approved);
}