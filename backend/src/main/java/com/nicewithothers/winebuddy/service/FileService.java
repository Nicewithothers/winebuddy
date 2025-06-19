package com.nicewithothers.winebuddy.service;

import com.nicewithothers.winebuddy.model.User;
import com.nicewithothers.winebuddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class FileService {
    @Value("${upload.path}")
    private String fileLocation;
    private final UserService userService;

    public String uploadPicture(String username, MultipartFile file) {
        File profileDirectory = new File(fileLocation);
        try {
            if (!profileDirectory.exists()) {
                profileDirectory.mkdir();
            }
            String fileName = String.format("%s_%s.%s",  UUID.randomUUID(), username, file.getOriginalFilename().split("\\.")[1]);
            Path filePath = Paths.get(fileLocation,  fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException ioe) {
            throw new RuntimeException(String.format("%s file couldn't be uploaded", ioe));
        }
    }

    public void deleteOldPicture(String username) {
        User user = userService.findByUsername(username);
        String[] profileSplit = user.getProfileURL().split("/");
        String fileName = profileSplit[profileSplit.length - 1];
        Path filePath = Paths.get(fileLocation, fileName);
        try {
            Files.deleteIfExists(filePath);
            user.setProfileURL(null);
        } catch (IOException ioe) {
            throw new RuntimeException(String.format("%s file couldn't be deleted", ioe));
        }
    }
}
