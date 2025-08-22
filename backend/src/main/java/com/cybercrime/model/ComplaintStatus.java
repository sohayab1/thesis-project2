package com.cybercrime.model;

public enum ComplaintStatus {
    SUBMITTED,             // Initial state when complaint is created
    APPROVAL_PENDING,      // Waiting for admin approval
    ENQUIRY_ONGOING,      // Under investigation 
    RESOLVED,             // Investigation complete and resolved
    UNRESOLVED            // Investigation complete but unresolved
}