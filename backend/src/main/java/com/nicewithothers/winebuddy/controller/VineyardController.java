package com.nicewithothers.winebuddy.controller;

import com.nicewithothers.winebuddy.mapper.UserMapper;
import com.nicewithothers.winebuddy.model.User;
import com.nicewithothers.winebuddy.model.Vineyard;
import com.nicewithothers.winebuddy.model.dto.user.UserDto;
import com.nicewithothers.winebuddy.model.dto.vineyard.VineyardRequest;
import com.nicewithothers.winebuddy.repository.UserRepository;
import com.nicewithothers.winebuddy.service.UserService;
import com.nicewithothers.winebuddy.service.VineyardService;
import com.nicewithothers.winebuddy.utility.JwtUtility;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.io.ParseException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/vineyard")
@RequiredArgsConstructor
public class VineyardController {
    private final VineyardService vineyardService;
    private final JwtUtility jwtUtility;
    private final UserService userService;
    private final UserMapper userMapper;
    private final UserRepository userRepository;

    @PostMapping("/createVineyard")
    public ResponseEntity<UserDto> create(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @RequestBody VineyardRequest vineyardRequest) {
        String username = jwtUtility.extractUsername(token);
        User user = userService.findByUsername(username);
        try {
            Vineyard vineyard = vineyardService.createVineyard(username, vineyardRequest);
            double area = vineyardService.calculateArea(vineyard);
            vineyard.setArea(area);
            user.setVineyard(vineyard);
            userRepository.save(user);
            return new ResponseEntity<>(userMapper.toUserDto(user), HttpStatus.OK);
        } catch (ParseException pe) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/deleteVineyard/{id}")
    public ResponseEntity<UserDto> deleteVineyard(@PathVariable Long id, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        String username = jwtUtility.extractUsername(token);
        User user = userService.findByUsername(username);
        userService.deleteUserVineyard(user);
        return new ResponseEntity<>(userMapper.toUserDto(user), HttpStatus.OK);
    }
}
