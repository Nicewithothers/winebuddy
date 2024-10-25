package com.nicewithothers.winebuddy.converter;


import com.nicewithothers.winebuddy.mapper.RoleMapper;
import com.nicewithothers.winebuddy.models.Roles;
import com.nicewithothers.winebuddy.models.dto.UserDto;
import com.nicewithothers.winebuddy.repository.TokenRepository;
import com.nicewithothers.winebuddy.utility.JwtUtility;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;

@Component
@RequiredArgsConstructor
public class UserConverter {
    private final TokenRepository tokenRepository;
    private final JwtUtility jwtUtility;
    private final RoleMapper roleMapper;

    public UserDto tokenToDto(String token) {
        Collection<Roles> roles = new ArrayList<>();
        roles = roleMapper.roleMapper(tokenRepository.findAuthResponseByToken(token).getRole());
        return UserDto.builder()
                .username(jwtUtility.extractUsername(token))
                .role(roles)
                .build();
    }
}
