package com.cybercrime.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "complaints")
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String location;

    @Column(name = "incident_date")
    private LocalDateTime incidentDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private ComplaintStatus status = ComplaintStatus.PENDING;

    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL)
    private List<Evidence> evidences;

    @Column(name = "resolved_date")
    private LocalDateTime resolvedDate;

    @Column(name = "resolution_notes")
    private String resolutionNotes;

    @Column(name = "priority")
    @Enumerated(EnumType.STRING)
    private ComplaintPriority priority;

    // Add this enum class
    public enum ComplaintPriority {
        LOW, MEDIUM, HIGH, CRITICAL
    }
}