package com.cybercrime.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EvidenceDto {
    private Long id;
    private String filename;
    private String fileType;
    private String filePath;
    private Long complaintId;
    private LocalDateTime uploadedAt;
    private Long fileSize;
    private String uploadedBy;
}