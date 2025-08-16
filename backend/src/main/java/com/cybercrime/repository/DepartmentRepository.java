package com.cybercrime.repository;

import com.cybercrime.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    boolean existsByName(String name);
    List<Department> findByActive(boolean active);

    @Query("SELECT d FROM Department d WHERE SIZE(d.complaints) > 0")
    List<Department> findDepartmentsWithComplaints();

    @Query("SELECT d FROM Department d LEFT JOIN FETCH d.departmentAdmins")
    List<Department> findAllWithAdmins();

    Optional<Department> findByName(String name);
}