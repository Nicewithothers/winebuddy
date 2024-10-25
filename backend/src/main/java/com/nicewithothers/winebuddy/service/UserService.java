package com.nicewithothers.winebuddy.service;

import com.nicewithothers.winebuddy.models.RegisterRequest;
import com.nicewithothers.winebuddy.models.Roles;
import com.nicewithothers.winebuddy.models.User;
import com.nicewithothers.winebuddy.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public String registerUser(RegisterRequest registerRequest) {
        User user = User.builder()
                .email(registerRequest.getEmail())
                .userName(registerRequest.getUserName())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(Roles.USER)
                .created(LocalDateTime.now())
                .build();
        userRepository.save(user);
        return "OK";
    }
}
