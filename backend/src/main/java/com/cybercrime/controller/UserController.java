package com.cybercrime.controller;

import com.cybercrime.model.User;
import com.cybercrime.dto.UserDto;
import com.cybercrime.dto.RegisterUserDto;
import com.cybercrime.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(
            @RequestPart("user") RegisterUserDto userDto,
            @RequestPart("nidFront") MultipartFile nidFront,
            @RequestPart("nidBack") MultipartFile nidBack,
            @RequestPart("selfieFront") MultipartFile selfieFront,
            @RequestPart("selfieLeft") MultipartFile selfieLeft,
            @RequestPart("selfieRight") MultipartFile selfieRight) {
        return ResponseEntity.ok(userService.registerUser(userDto, nidFront, nidBack, 
                               selfieFront, selfieLeft, selfieRight));
    }

    @PutMapping("/{userId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> approveUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.approveUser(userId));
    }
}