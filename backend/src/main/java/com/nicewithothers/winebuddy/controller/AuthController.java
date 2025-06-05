package com.nicewithothers.winebuddy.controller;

import com.nicewithothers.winebuddy.mapper.UserMapper;
import com.nicewithothers.winebuddy.model.dto.user.LoginRequest;
import com.nicewithothers.winebuddy.model.dto.user.RegisterRequest;
import com.nicewithothers.winebuddy.model.dto.user.UserDto;
import com.nicewithothers.winebuddy.service.UserService;
import com.nicewithothers.winebuddy.utility.JwtUtility;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final UserMapper userMapper;
    private final JwtUtility jwtUtility;

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@Valid @RequestBody RegisterRequest registerRequest) {
        HttpHeaders headers = new HttpHeaders();
        UserDto userDto = userService.registerUser(registerRequest);
        return new ResponseEntity<>(userDto, headers, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@Valid @RequestBody LoginRequest loginRequest) {
        HttpHeaders headers = new HttpHeaders();
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtility.generateToken(userDetails);
            headers.add("Authorization", token);
            return new ResponseEntity<>(
                    userMapper.toUserDto(userService.findByUsername(loginRequest.getUsername())), headers, HttpStatus.OK);
        } catch (AuthenticationException ae) {
            headers.add("Authorization", "");
            return new ResponseEntity<>(headers, HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/getUser")
    public ResponseEntity<UserDto> getUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        if (token != null) {
            String username = jwtUtility.extractUsername(token);
            UserDto userDto = userMapper.toUserDto(userService.findByUsername(username));
            return new ResponseEntity<>(userDto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
}
