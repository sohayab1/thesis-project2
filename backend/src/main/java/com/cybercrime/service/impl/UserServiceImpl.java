package com.cybercrime.service.impl;

import com.cybercrime.model.User;  // Changed from org.apache.catalina.User
import com.cybercrime.model.UserRole;
import com.cybercrime.dto.RegisterUserDto;
import com.cybercrime.dto.UserDto;
import com.cybercrime.mapper.EntityMapperService;
import com.cybercrime.repository.UserRepository;
import com.cybercrime.service.FileStorageService;
import com.cybercrime.service.UserService;
import com.cybercrime.exception.ResourceNotFoundException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final EntityMapperService mapper;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional
    public UserDto registerUser(RegisterUserDto registerUserDto,
                              MultipartFile nidFront,
                              MultipartFile nidBack,
                              MultipartFile selfieFront,
                              MultipartFile selfieLeft,
                              MultipartFile selfieRight) {
        User user = mapper.toUser(registerUserDto);
        
        // Store files
        user.setNidFrontPath(fileStorageService.store(nidFront, "nid"));
        user.setNidBackPath(fileStorageService.store(nidBack, "nid"));
        user.setSelfieFrontPath(fileStorageService.store(selfieFront, "selfie"));
        user.setSelfieLeftPath(fileStorageService.store(selfieLeft, "selfie"));
        user.setSelfieRightPath(fileStorageService.store(selfieRight, "selfie"));
        
        // Set default values
        user.setApproved(false);
        user.setRole(UserRole.USER);
        
        User savedUser = userRepository.save(user);
        return mapper.toUserDto(savedUser);
    }

    @Override
    @Transactional
    public UserDto approveUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setApproved(true);
        return mapper.toUserDto(userRepository.save(user));
    }
}