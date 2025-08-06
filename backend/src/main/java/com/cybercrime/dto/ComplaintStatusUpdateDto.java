package com.cybercrime.dto;

import com.cybercrime.model.ComplaintStatus;
import lombok.Data;

@Data
public class ComplaintStatusUpdateDto {
    private ComplaintStatus status;
    private String comment;
}