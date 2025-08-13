package com.cybercrime.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    @Async
    public void sendApprovalEmail(String to, String name, boolean approved) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject("Registration " + (approved ? "Approved" : "Rejected"));
            
            String htmlContent = approved ? 
                getApprovalTemplate(name) :
                getRejectionTemplate(name);
            
            helper.setText(htmlContent, true);
            mailSender.send(message);
            
            log.info("Sent {} email to: {}", approved ? "approval" : "rejection", to);
        } catch (MessagingException e) {
            log.error("Failed to send email to: " + to, e);
        }
    }
    
    private String getApprovalTemplate(String name) {
        return String.format("""
            <html>
                <body>
                    <h2>Welcome to Cybercrime Reporting System</h2>
                    <p>Dear %s,</p>
                    <p>Your registration has been approved! You can now log in to your account and start using our services.</p>
                    <p>If you have any questions, please don't hesitate to contact us.</p>
                    <br>
                    <p>Best regards,</p>
                    <p>Cybercrime Reporting Team</p>
                </body>
            </html>
            """, name);
    }
    
    private String getRejectionTemplate(String name) {
        return String.format("""
            <html>
                <body>
                    <h2>Registration Status Update</h2>
                    <p>Dear %s,</p>
                    <p>We regret to inform you that your registration has been rejected.</p>
                    <p>This could be due to various reasons including incomplete or incorrect information.</p>
                    <p>You may try registering again with the correct information.</p>
                    <br>
                    <p>Best regards,</p>
                    <p>Cybercrime Reporting Team</p>
                </body>
            </html>
            """, name);
    }
}