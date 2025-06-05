package com.nicewithothers.winebuddy.controller;

import com.nicewithothers.winebuddy.model.dto.user.AuthResponse;
import com.nicewithothers.winebuddy.model.dto.user.LoginRequest;
import com.nicewithothers.winebuddy.model.dto.user.RegisterRequest;
import com.nicewithothers.winebuddy.model.dto.user.UserDto;
import com.nicewithothers.winebuddy.service.AuthService;
import com.nicewithothers.winebuddy.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.SameSiteCookies;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@Valid @RequestBody RegisterRequest registerRequest) {
        HttpHeaders headers = new HttpHeaders();
        UserDto userDto = userService.registerUser(registerRequest);
        return new ResponseEntity<>(userDto, headers, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) throws Exception {
        try {
            HttpHeaders headers = new HttpHeaders();
            AuthResponse auth = authService.authenticate(loginRequest);

            ResponseCookie cookie = ResponseCookie.from("authCookie", auth.getToken())
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(Duration.ofHours(1))
                    .sameSite(SameSiteCookies.STRICT.toString())
                    .build();
            headers.add(HttpHeaders.SET_COOKIE, cookie.toString());
            return new ResponseEntity<>(auth, headers, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error while authenticating user", e);
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
}
