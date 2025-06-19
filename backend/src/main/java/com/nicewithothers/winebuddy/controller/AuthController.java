package com.nicewithothers.winebuddy.controller;

import com.nicewithothers.winebuddy.mapper.UserMapper;
import com.nicewithothers.winebuddy.model.User;
import com.nicewithothers.winebuddy.model.dto.user.AuthResponse;
import com.nicewithothers.winebuddy.model.dto.user.LoginRequest;
import com.nicewithothers.winebuddy.model.dto.user.RegisterRequest;
import com.nicewithothers.winebuddy.model.dto.user.UserDto;
import com.nicewithothers.winebuddy.service.UserService;
import com.nicewithothers.winebuddy.utility.JwtUtility;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtility jwtUtility;
    private final UserMapper userMapper;

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@Valid @RequestBody RegisterRequest registerRequest) {
        HttpHeaders headers = new HttpHeaders();
        UserDto userDto = userService.registerUser(registerRequest);
        return new ResponseEntity<>(userDto, headers, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        HttpHeaders headers = new HttpHeaders();
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtility.generateToken(userDetails);
            UserDto userDto = userMapper.toUserDto(userService.findByUsername(loginRequest.getUsername()));
            AuthResponse authResponse = AuthResponse.builder()
                    .user(userDto)
                    .token(token)
                    .build();
            return new ResponseEntity<>(authResponse, headers, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error while authenticating user", e);
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
}
