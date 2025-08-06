package com.cybercrime.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class AuthResponseDto {
    private String token;
    private UserDto user;
}