package com.cybercrime.service.impl;

import com.cybercrime.dto.RegisterUserDto;
import com.cybercrime.dto.UserDto;
import com.cybercrime.model.User;
import com.cybercrime.repository.UserRepository;
import com.cybercrime.service.UserService;
import com.cybercrime.service.FileStorageService;  // Add this import
import com.cybercrime.mapper.EntityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final EntityMapper entityMapper;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional
    public UserDto registerUser(RegisterUserDto registerUserDto,
                              MultipartFile nidFront,
                              MultipartFile nidBack,
                              MultipartFile selfieFront,
                              MultipartFile selfieLeft,
                              MultipartFile selfieRight) {
        User user = entityMapper.toUser(registerUserDto);
        
        // Store files and set paths
        user.setNidFrontPath(fileStorageService.store(nidFront, "nid"));
        user.setNidBackPath(fileStorageService.store(nidBack, "nid"));
        user.setSelfieFrontPath(fileStorageService.store(selfieFront, "selfie"));
        user.setSelfieLeftPath(fileStorageService.store(selfieLeft, "selfie"));
        user.setSelfieRightPath(fileStorageService.store(selfieRight, "selfie"));
        
        user.setApproved(false);
        User savedUser = userRepository.save(user);
        
        return entityMapper.toUserDto(savedUser);
    }

    @Override
    @Transactional
    public UserDto approveUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setApproved(true);
        return entityMapper.toUserDto(userRepository.save(user));
    }
}