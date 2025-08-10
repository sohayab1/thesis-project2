package com.cybercrime.exception;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class CustomErrorResponse {
    private int status;
    private String message;
    private LocalDateTime timestamp;
}