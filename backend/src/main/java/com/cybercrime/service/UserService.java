package com.cybercrime.service;

import com.cybercrime.dto.RegisterUserDto;
import com.cybercrime.dto.UserDto;
import com.cybercrime.dto.UserUpdateDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {
    UserDto registerUser(RegisterUserDto userDto,
                        MultipartFile nidFront,
                        MultipartFile nidBack,
                        MultipartFile selfieFront,
                        MultipartFile selfieLeft,
                        MultipartFile selfieRight);

    UserDto approveUser(Long userId);

    UserDto updateUser(Long userId, UserUpdateDto userDto);

    void deleteUser(Long userId);

    UserDto getUserProfile(Long userId);

    List<UserDto> getUsersByDepartment(Long departmentId);
}