package com.cybercrime.service.impl;

import com.cybercrime.dto.AuthResponseDto;
import com.cybercrime.dto.LoginDto;
import com.cybercrime.dto.UserDto;
import com.cybercrime.model.User;
import com.cybercrime.repository.UserRepository;
import com.cybercrime.service.AuthService;
import com.cybercrime.mapper.EntityMapperService;
import com.cybercrime.config.JwtTokenProvider;
import com.cybercrime.exception.UnauthorizedException;
import com.cybercrime.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final EntityMapperService mapper;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public AuthResponseDto login(LoginDto loginDto) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword())
            );

            User user = userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            if (!user.isApproved()) {
                throw new UnauthorizedException("Account is not approved yet");
            }

            String token = jwtTokenProvider.generateToken(authentication);
            UserDto userDto = mapper.toUserDto(user);

            return AuthResponseDto.builder()
                .token(token)
                .user(userDto)
                .build();
        } catch (BadCredentialsException e) {
            throw new UnauthorizedException("Invalid email or password");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponseDto refreshToken(String token) {
        if (!validateToken(token)) {
            throw new UnauthorizedException("Invalid token");
        }

        String email = jwtTokenProvider.getEmailFromToken(token);
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String newToken = jwtTokenProvider.generateToken(email);
        UserDto userDto = mapper.toUserDto(user);

        return AuthResponseDto.builder()
            .token(newToken)
            .user(userDto)
            .build();
    }

    @Override
    public void logout(String token) {
        jwtTokenProvider.invalidateToken(token);
    }

    @Override
    public boolean validateToken(String token) {
        return jwtTokenProvider.validateToken(token);
    }
}