package com.cybercrime.service;

import com.cybercrime.exception.FileStorageException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path rootLocation = Paths.get("uploads");

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new FileStorageException("Could not initialize storage location", e);
        }
    }

    public String store(MultipartFile file, String directory) {
        try {
            if (file.isEmpty()) {
                throw new FileStorageException("Failed to store empty file");
            }

            Path dirPath = rootLocation.resolve(directory);
            Files.createDirectories(dirPath);
            
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path destinationFile = dirPath.resolve(filename)
                    .normalize()
                    .toAbsolutePath();

            if (!destinationFile.getParent().equals(dirPath.toAbsolutePath())) {
                throw new FileStorageException("Cannot store file outside current directory");
            }

            file.transferTo(destinationFile);

            return directory + "/" + filename;
        } catch (IOException e) {
            throw new FileStorageException("Failed to store file", e);
        }
    }

    public byte[] load(String filePath) {
        try {
            Path file = rootLocation.resolve(filePath).normalize();
            if (!file.toAbsolutePath().startsWith(rootLocation.toAbsolutePath())) {
                throw new FileStorageException("Cannot read file outside current directory");
            }
            return Files.readAllBytes(file);
        } catch (IOException e) {
            throw new FileStorageException("Failed to read file: " + filePath, e);
        }
    }

    public void delete(String filePath) {
        try {
            Path file = rootLocation.resolve(filePath).normalize();
            if (!file.toAbsolutePath().startsWith(rootLocation.toAbsolutePath())) {
                throw new FileStorageException("Cannot delete file outside current directory");
            }
            Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new FileStorageException("Failed to delete file: " + filePath, e);
        }
    }

    public boolean exists(String filePath) {
        Path file = rootLocation.resolve(filePath).normalize();
        return Files.exists(file);
    }
}

