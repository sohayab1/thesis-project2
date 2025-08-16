package com.cybercrime.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.cybercrime.model.User;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    public void sendApprovalEmail(String email, String name, boolean approved) {
        // For now, just log the email
        log.info("Sending {} email to {} ({})", 
            approved ? "approval" : "rejection", 
            name, 
            email);
    }

    public void sendApprovalEmail(User user) {
        sendApprovalEmail(user.getEmail(), user.getName(), user.isApproved());
    }
}