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

    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    private Department department;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    private String location;
    private LocalDateTime incidentDate;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedDate;
    private LocalDateTime feedbackDate;
    
    @Enumerated(EnumType.STRING)
    private ComplaintStatus status;
    
    @Enumerated(EnumType.STRING)
    private ComplaintPriority priority;
    
    private Integer rating;
    
    @Column(columnDefinition = "TEXT")
    private String feedback;
    
    @Column(columnDefinition = "TEXT")
    private String resolutionNotes;
    
    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Evidence> evidences;

    public enum ComplaintPriority {
        LOW, MEDIUM, HIGH, CRITICAL
    }
}