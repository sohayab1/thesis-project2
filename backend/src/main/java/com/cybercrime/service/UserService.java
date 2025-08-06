package com.cybercrime.service;

import com.cybercrime.dto.RegisterUserDto;
import com.cybercrime.dto.UserDto;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    UserDto registerUser(RegisterUserDto userDto, 
                        MultipartFile nidFront, 
                        MultipartFile nidBack,
                        MultipartFile selfieFront,
                        MultipartFile selfieLeft,
                        MultipartFile selfieRight);
    
    UserDto approveUser(Long userId);
}