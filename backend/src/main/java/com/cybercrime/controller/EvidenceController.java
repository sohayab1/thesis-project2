package com.cybercrime.controller;

import com.cybercrime.dto.EvidenceDto;
import com.cybercrime.service.EvidenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/evidences")
@RequiredArgsConstructor
public class EvidenceController {
    private final EvidenceService evidenceService;

    @PostMapping("/upload/{complaintId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<EvidenceDto> uploadEvidence(
            @PathVariable Long complaintId,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal String username) {
        return ResponseEntity.ok(evidenceService.uploadEvidence(complaintId, file, username));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<EvidenceDto> getEvidence(@PathVariable Long id) {
        return ResponseEntity.ok(evidenceService.getEvidence(id));
    }

    @GetMapping("/complaint/{complaintId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<EvidenceDto>> getEvidencesByComplaint(@PathVariable Long complaintId) {
        return ResponseEntity.ok(evidenceService.getEvidencesByComplaint(complaintId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEvidence(@PathVariable Long id) {
        evidenceService.deleteEvidence(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/download/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ByteArrayResource> downloadEvidence(@PathVariable Long id) {
        EvidenceDto evidence = evidenceService.getEvidence(id);
        byte[] data = evidenceService.downloadEvidence(id);
        ByteArrayResource resource = new ByteArrayResource(data);

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + evidence.getFilename())
            .contentType(MediaType.parseMediaType(evidence.getFileType()))
            .contentLength(data.length)
            .body(resource);
    }
}