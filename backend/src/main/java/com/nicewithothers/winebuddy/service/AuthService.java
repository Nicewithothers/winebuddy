package com.nicewithothers.winebuddy.service;

import com.nicewithothers.winebuddy.converter.UserConverter;
import com.nicewithothers.winebuddy.models.AuthRequest;
import com.nicewithothers.winebuddy.models.dto.UserDto;
import com.nicewithothers.winebuddy.utility.JwtUtility;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtUtility jwtUtility;
    private final UserConverter userConverter;

    public String generateToken(UserDetails userDetails) {
        return jwtUtility.generateToken(userDetails);
    }

    public void invalidateToken(String token) {
        jwtUtility.invalidateToken(token);
    }

    public UserDto getUserDataFromToken(String token) {
        return userConverter.tokenToDto(token);
    }

    public String authenticate(AuthRequest authRequestStr) throws Exception {
        String userName = authRequestStr.getUsername();
        String password = authRequestStr.getPassword();
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userName, password));
        try {
            return this.generateToken((UserDetails)authentication.getPrincipal());
        } catch (DisabledException de) {
            throw new DisabledException("User is disabled.", de);
        } catch (BadCredentialsException be) {
            throw new BadCredentialsException("User has invalid credentials.", be);
        }
    }
}
