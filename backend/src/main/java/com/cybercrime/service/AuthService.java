package com.cybercrime.service;

import com.cybercrime.dto.AuthResponseDto;
import com.cybercrime.dto.LoginDto;

public interface AuthService {
    AuthResponseDto login(LoginDto loginDto);
    AuthResponseDto refreshToken(String token);
    void logout(String token);
    boolean validateToken(String token);
}