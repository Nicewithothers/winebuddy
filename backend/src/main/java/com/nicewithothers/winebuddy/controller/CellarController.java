package com.nicewithothers.winebuddy.controller;

import com.nicewithothers.winebuddy.mapper.UserMapper;
import com.nicewithothers.winebuddy.model.Cellar;
import com.nicewithothers.winebuddy.model.User;
import com.nicewithothers.winebuddy.model.dto.cellar.CellarRequest;
import com.nicewithothers.winebuddy.model.dto.user.UserDto;
import com.nicewithothers.winebuddy.repository.UserRepository;
import com.nicewithothers.winebuddy.repository.VineyardRepository;
import com.nicewithothers.winebuddy.service.CellarService;
import com.nicewithothers.winebuddy.service.UserService;
import com.nicewithothers.winebuddy.utility.JwtUtility;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cellar")
@RequiredArgsConstructor
public class CellarController {
    private final VineyardRepository vineyardRepository;
    private final JwtUtility jwtUtility;
    private final UserService userService;
    private final CellarService cellarService;
    private final UserMapper userMapper;
    private final UserRepository userRepository;

    @PostMapping("/createCellar")
    public ResponseEntity<UserDto> createCellar(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @RequestBody CellarRequest cellarRequest) {
        String username = jwtUtility.extractUsername(token);
        User user = userService.findByUsername(username);
        try {
            Cellar cellar = cellarService.createCellar(user.getVineyard(), cellarRequest);
            double area = cellarService.calculateArea(cellar);
            cellar.setArea(area);
            user.getVineyard().getCellars().add(cellar);
            vineyardRepository.save(user.getVineyard());
            userRepository.save(user);
            return new ResponseEntity<>(userMapper.toUserDto(user), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
