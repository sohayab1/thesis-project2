package com.cybercrime.controller;

import com.cybercrime.model.User;
import com.cybercrime.dto.UserDto;
import com.cybercrime.dto.UserUpdateDto;
import com.cybercrime.dto.RegisterUserDto;
import com.cybercrime.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(
            @Valid @RequestPart("user") RegisterUserDto userDto,
            @RequestPart("nidFront") MultipartFile nidFront,
            @RequestPart("nidBack") MultipartFile nidBack,
            @RequestPart("selfieFront") MultipartFile selfieFront,
            @RequestPart("selfieLeft") MultipartFile selfieLeft,
            @RequestPart("selfieRight") MultipartFile selfieRight) {
        return ResponseEntity.ok(userService.registerUser(userDto, nidFront, nidBack, 
                               selfieFront, selfieLeft, selfieRight));
    }

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDto> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.getUserProfile(user.getId()));
    }

    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDto> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UserUpdateDto updateDto) {
        return ResponseEntity.ok(userService.updateUser(user.getId(), updateDto));
    }

    @PutMapping("/{userId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> approveUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.approveUser(userId));
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_ADMIN')")
    public ResponseEntity<List<UserDto>> getUsersByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(userService.getUsersByDepartment(departmentId));
    }
}