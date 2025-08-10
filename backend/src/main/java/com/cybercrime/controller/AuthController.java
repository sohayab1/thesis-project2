package com.cybercrime.controller;

import com.cybercrime.dto.LoginDto;
import com.cybercrime.dto.RegisterUserDto;
import com.cybercrime.dto.UserDto;
import com.cybercrime.dto.AuthResponseDto;
import com.cybercrime.service.AuthService;
import com.cybercrime.service.UserService;

import org.springframework.http.MediaType;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")  // Base path for authentication-related endpoints
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final UserService userService;
    private final AuthService authService;

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> register(
            @Valid @RequestPart("user") RegisterUserDto userDto,
            @RequestPart("nidFront") MultipartFile nidFront,
            @RequestPart("nidBack") MultipartFile nidBack,
            @RequestPart("selfieFront") MultipartFile selfieFront,
            @RequestPart("selfieLeft") MultipartFile selfieLeft,
            @RequestPart("selfieRight") MultipartFile selfieRight) {
        
        try {
            log.info("Received registration request for user: {}", userDto.getEmail());
            log.info("Files received: nidFront={}, nidBack={}, selfieFront={}, selfieLeft={}, selfieRight={}", 
                nidFront != null ? nidFront.getOriginalFilename() : "null",
                nidBack != null ? nidBack.getOriginalFilename() : "null",
                selfieFront != null ? selfieFront.getOriginalFilename() : "null",
                selfieLeft != null ? selfieLeft.getOriginalFilename() : "null",
                selfieRight != null ? selfieRight.getOriginalFilename() : "null");
            
            // Validate files
            if (nidFront == null || nidFront.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "NID Front image is required"));
            }
            if (nidBack == null || nidBack.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "NID Back image is required"));
            }
            if (selfieFront == null || selfieFront.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Selfie Front image is required"));
            }
            if (selfieLeft == null || selfieLeft.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Selfie Left image is required"));
            }
            if (selfieRight == null || selfieRight.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Selfie Right image is required"));
            }
            
            UserDto result = userService.registerUser(userDto, nidFront, nidBack,
                    selfieFront, selfieLeft, selfieRight);
            
            log.info("User registered successfully: {}", result.getEmail());
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            log.error("Error during user registration: ", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginDto loginDto) {
        return ResponseEntity.ok(authService.login(loginDto));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponseDto> refreshToken(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(authService.refreshToken(token));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String token) {
        authService.logout(token);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> test() {
        log.info("Test endpoint called");
        Map<String, String> response = new HashMap<>();
        response.put("message", "Test endpoint working successfully");
        response.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }
}