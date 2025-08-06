package com.cybercrime.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "evidences")
public class Evidence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String filename;

    @Column(nullable = false)
    private String fileType;

    @Column(nullable = false)
    private String filePath;

    @ManyToOne
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;
}