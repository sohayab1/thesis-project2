package com.cybercrime.service;

import com.cybercrime.dto.RegisterUserDto;
import com.cybercrime.dto.UserDto;
import com.cybercrime.dto.UserUpdateDto;
import com.cybercrime.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface UserService {
    UserDto registerUser(RegisterUserDto userDto,
                        MultipartFile nidFront,
                        MultipartFile nidBack,
                        MultipartFile selfieFront,
                        MultipartFile selfieLeft,
                        MultipartFile selfieRight);
    UserDto approveUser(Long userId);
    UserDto rejectUser(Long userId);
    UserDto updateUser(Long userId, UserUpdateDto userDto);
    void deleteUser(Long userId);
    UserDto getUserProfile(Long userId);
    List<UserDto> getUsersByDepartment(Long departmentId);
    boolean existsByEmail(String email);
    boolean existsByNidNumber(String nidNumber);
    void updatePassword(Long userId, String currentPassword, String newPassword);
    Optional<User> findByEmail(String email);
    User save(User user);
    List<User> getAllUsers();
    Optional<User> findById(Long id);
    void delete(Long id);
    User update(User user);
}