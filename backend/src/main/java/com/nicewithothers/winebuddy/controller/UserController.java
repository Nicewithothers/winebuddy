package com.nicewithothers.winebuddy.controller;

import com.nicewithothers.winebuddy.models.AuthRequest;
import com.nicewithothers.winebuddy.models.RegisterRequest;
import com.nicewithothers.winebuddy.models.dto.UserDto;
import com.nicewithothers.winebuddy.service.AuthService;
import com.nicewithothers.winebuddy.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<UserDto> loginWithTokenGeneration(@RequestBody AuthRequest authRequest) throws Exception {
        HttpHeaders httpHeaders = new HttpHeaders();
        String token = authService.authenticate(authRequest);
        httpHeaders.add("Authorization", "Bearer " + token);
        return new ResponseEntity<>(authService.getUserDataFromToken(token), httpHeaders, HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logoutWithTokenInvalidation(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) throws Exception {
        String[] tokenSplitted = token.split("Bearer ");
        authService.invalidateToken(tokenSplitted[1]);
        return new ResponseEntity<>("Logged out", HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest) throws Exception {
        HttpHeaders httpHeaders = new HttpHeaders();
        userService.registerUser(registerRequest);
        return new ResponseEntity<>(registerRequest.getUserName(), httpHeaders, HttpStatus.OK);
    }

    @GetMapping("/getUserByToken")
    public ResponseEntity<UserDto> getUserDataByToken(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) throws Exception {
        String[] tokenSplitted = token.split("Bearer ");
        return new ResponseEntity<>(authService.getUserDataFromToken(tokenSplitted[1]), HttpStatus.OK);
    }
}
