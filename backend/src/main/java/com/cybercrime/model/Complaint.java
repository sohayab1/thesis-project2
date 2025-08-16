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
    
    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    private ComplaintPriority priority;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ComplaintStatus status;
    
    private String suspectInfo;
    private String suspectSocialMedia;
    private String suspectPhoneNumber;
    private Integer rating;
    private String feedback;
    
    @Column(name = "feedback_date")
    private LocalDateTime feedbackDate;
    
    @Column(columnDefinition = "TEXT")
    private String resolutionNotes;
    
    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Evidence> evidences;
}