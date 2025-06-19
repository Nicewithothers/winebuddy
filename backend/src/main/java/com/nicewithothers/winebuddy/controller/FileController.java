package com.nicewithothers.winebuddy.controller;

import com.nicewithothers.winebuddy.mapper.UserMapper;
import com.nicewithothers.winebuddy.model.User;
import com.nicewithothers.winebuddy.model.dto.user.UserDto;
import com.nicewithothers.winebuddy.repository.UserRepository;
import com.nicewithothers.winebuddy.service.FileService;
import com.nicewithothers.winebuddy.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {
    private final FileService fileService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @PostMapping("/{username}/changeProfile")
    public ResponseEntity<UserDto> changeProfile(@PathVariable String username, @RequestParam("file") MultipartFile file) {
        User user = userService.findByUsername(username);
        if (user.getProfileURL() != null) {
            fileService.deleteOldPicture(username);
        }
        String filename = fileService.uploadPicture(user.getUsername(), file);
        user.setProfileURL(String.format("http://localhost:8080/profiles/%s", filename));
        userRepository.save(user);
        return new ResponseEntity<>(userMapper.toUserDto(user), HttpStatus.OK);
    }
}
