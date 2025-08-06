package com.cybercrime.service.impl;

import com.cybercrime.dto.AuthResponseDto;
import com.cybercrime.dto.LoginDto;
import com.cybercrime.dto.UserDto;
import com.cybercrime.model.User;
import com.cybercrime.repository.UserRepository;
import com.cybercrime.service.AuthService;
import com.cybercrime.mapper.EntityMapper;
import com.cybercrime.config.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final EntityMapper entityMapper;
    private final UserRepository userRepository;

    @Override
    public AuthResponseDto login(LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword())
        );
        
        User user = userRepository.findByEmail(loginDto.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        String token = jwtTokenProvider.generateToken(authentication);
        UserDto userDto = entityMapper.toUserDto(user);
        
        return AuthResponseDto.builder()
            .token(token)
            .user(userDto)
            .build();
    }
}