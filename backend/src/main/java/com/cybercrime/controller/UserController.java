package com.cybercrime.controller;

import com.cybercrime.model.User;
import com.cybercrime.security.CustomUserDetails;
import com.cybercrime.dto.UserDto;
import com.cybercrime.dto.UserUpdateDto;
import com.cybercrime.dto.RegisterUserDto;
import com.cybercrime.dto.UserFeedbackDto;
import com.cybercrime.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
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
    public ResponseEntity<UserDto> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        log.debug("Received profile request for user details: {}", userDetails);
        if (userDetails == null) {
            throw new IllegalStateException("User details not found in security context");
        }
        return ResponseEntity.ok(userService.getUserProfile(userDetails.getUser().getId()));
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

    @PostMapping("/feedback")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDto> submitFeedback(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UserFeedbackDto feedback
    ) {
        return ResponseEntity.ok(userService.submitFeedback(userDetails.getUser().getId(), feedback));
    }

    @GetMapping("/feedback")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserFeedbackDto> getFeedback(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(userService.getUserFeedback(userDetails.getUser().getId()));
    }
}