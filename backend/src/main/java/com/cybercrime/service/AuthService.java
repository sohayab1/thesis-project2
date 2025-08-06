package com.cybercrime.service;

import com.cybercrime.dto.AuthResponseDto;
import com.cybercrime.dto.LoginDto;

public interface AuthService {
    AuthResponseDto login(LoginDto loginDto);
}