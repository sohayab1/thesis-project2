package com.cybercrime.dto;

import com.cybercrime.model.ComplaintStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ComplaintStatusUpdateDto {
    @NotNull
    private ComplaintStatus status;
    private String notes;
}