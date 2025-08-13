package com.cybercrime.service.impl;

import com.cybercrime.model.Department;
import com.cybercrime.model.User;
import com.cybercrime.model.UserRole;
import com.cybercrime.dto.RegisterUserDto;
import com.cybercrime.dto.UserDto;
import com.cybercrime.dto.UserUpdateDto;
import com.cybercrime.mapper.EntityMapperService;
import com.cybercrime.repository.UserRepository;
import com.cybercrime.repository.DepartmentRepository;
import com.cybercrime.service.FileStorageService;
import com.cybercrime.service.UserService;
import com.cybercrime.exception.ResourceNotFoundException;
import com.cybercrime.exception.DuplicateResourceException;
import com.cybercrime.exception.UnauthorizedException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final EntityMapperService mapper;
    private final FileStorageService fileStorageService;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserDto registerUser(RegisterUserDto registerUserDto,
                              MultipartFile nidFront,
                              MultipartFile nidBack,
                              MultipartFile selfieFront,
                              MultipartFile selfieLeft,
                              MultipartFile selfieRight) {
        validateNewUser(registerUserDto);
        validateDocuments(nidFront, nidBack, selfieFront, selfieLeft, selfieRight);
        
        User user = mapper.toUser(registerUserDto);
        user.setPassword(passwordEncoder.encode(registerUserDto.getPassword()));
        
        storeUserDocuments(user, nidFront, nidBack, selfieFront, selfieLeft, selfieRight);
        
        user.setApproved(false);
        user.setRole(UserRole.USER);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        return mapper.toUserDto(savedUser);
    }

    @Override
    @Transactional
    public UserDto updateUser(Long userId, UserUpdateDto userDto) {
        User user = findUserById(userId);
        
        // Validate email uniqueness
        if (userDto.getEmail() != null && !user.getEmail().equals(userDto.getEmail()) && 
            userRepository.existsByEmail(userDto.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }
        
        // Update basic info
        if (userDto.getName() != null) {
            user.setName(userDto.getName());
        }
        if (userDto.getEmail() != null) {
            user.setEmail(userDto.getEmail());
        }
        if (userDto.getNidNumber() != null) {
            user.setNidNumber(userDto.getNidNumber());
        }
        
        // Update department if provided
        if (userDto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(userDto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            user.setDepartment(department);
        }
        
        // Handle password update
        if (userDto.getCurrentPassword() != null && userDto.getNewPassword() != null) {
            if (!passwordEncoder.matches(userDto.getCurrentPassword(), user.getPassword())) {
                throw new UnauthorizedException("Current password is incorrect");
            }
            user.setPassword(passwordEncoder.encode(userDto.getNewPassword()));
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        return mapper.toUserDto(userRepository.save(user));
    }

    @Override
    @Transactional
    public void updatePassword(Long userId, String currentPassword, String newPassword) {
        User user = findUserById(userId);
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new UnauthorizedException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public UserDto approveUser(Long userId) {
        User user = findUserById(userId);
        user.setApproved(true);
        user.setUpdatedAt(LocalDateTime.now());
        return mapper.toUserDto(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserDto rejectUser(Long userId) {
        User user = findUserById(userId);
        userRepository.delete(user);
        return mapper.toUserDto(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = findUserById(userId);
        userRepository.delete(user);
    }

    @Override
    public UserDto getUserProfile(Long userId) {
        return mapper.toUserDto(findUserById(userId));
    }

    @Override
    public List<UserDto> getUsersByDepartment(Long departmentId) {
        return userRepository.findByDepartmentId(departmentId).stream()
                .map(mapper::toUserDto)
                .toList();
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByNidNumber(String nidNumber) {
        return userRepository.existsByNidNumber(nidNumber);
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void validateNewUser(RegisterUserDto userDto) {
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }
        if (userRepository.existsByNidNumber(userDto.getNidNumber())) {
            throw new DuplicateResourceException("NID number already exists");
        }
    }

    private void storeUserDocuments(User user, MultipartFile nidFront, MultipartFile nidBack,
                                  MultipartFile selfieFront, MultipartFile selfieLeft, 
                                  MultipartFile selfieRight) {
        user.setNidFrontPath(fileStorageService.store(nidFront, "nid"));
        user.setNidBackPath(fileStorageService.store(nidBack, "nid"));
        user.setSelfieFrontPath(fileStorageService.store(selfieFront, "selfie"));
        user.setSelfieLeftPath(fileStorageService.store(selfieLeft, "selfie"));
        user.setSelfieRightPath(fileStorageService.store(selfieRight, "selfie"));
    }

    private void validateDocuments(MultipartFile... files) {
        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                throw new IllegalArgumentException("Required document is missing");
            }
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new IllegalArgumentException("Invalid file type. Only images are allowed");
            }
        }
    }
}