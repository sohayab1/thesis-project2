package com.cybercrime.service.impl;

import com.cybercrime.model.Department;
import com.cybercrime.model.User;  
import com.cybercrime.model.UserRole;
import com.cybercrime.dto.RegisterUserDto;
import com.cybercrime.dto.UserDto;
import com.cybercrime.dto.UserUpdateDto;
import com.cybercrime.mapper.EntityMapperService;
import com.cybercrime.repository.UserRepository;
import com.cybercrime.service.FileStorageService;
import com.cybercrime.service.UserService;
import com.cybercrime.exception.ResourceNotFoundException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

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

    @Override
    @Transactional
    public UserDto updateUser(Long userId, UserUpdateDto userDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        
        if (userDto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(userDto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            user.setDepartment(department);
        }
        
        return mapper.toUserDto(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(userId);
    }

    @Override
    public UserDto getUserProfile(Long userId) {
        return mapper.toUserDto(userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found")));
    }

    @Override
    public List<UserDto> getUsersByDepartment(Long departmentId) {
        return userRepository.findByDepartmentId(departmentId).stream()
                .map(mapper::toUserDto)
                .collect(Collectors.toList());
    }
}