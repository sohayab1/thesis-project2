package com.cybercrime.dto;

import lombok.Data;

@Data
public class EvidenceDto {
    private Long id;
    private String filename;
    private String fileType;
    private String filePath;
}