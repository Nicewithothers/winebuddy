package com.nicewithothers.winebuddy.controller;

import com.nicewithothers.winebuddy.mapper.UserMapper;
import com.nicewithothers.winebuddy.model.User;
import com.nicewithothers.winebuddy.model.Vineyard;
import com.nicewithothers.winebuddy.model.dto.user.UserDto;
import com.nicewithothers.winebuddy.model.dto.vineyard.VineyardRequest;
import com.nicewithothers.winebuddy.repository.UserRepository;
import com.nicewithothers.winebuddy.repository.VineyardRepository;
import com.nicewithothers.winebuddy.service.UserService;
import com.nicewithothers.winebuddy.service.VineyardService;
import com.nicewithothers.winebuddy.utility.JwtUtility;
import com.nicewithothers.winebuddy.utility.ShapeUtility;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.io.ParseException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;

@RestController
@RequestMapping("/api/vineyard")
@RequiredArgsConstructor
public class VineyardController {
    private final JwtUtility jwtUtility;
    private final UserService userService;
    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final VineyardService vineyardService;
    private final VineyardRepository vineyardRepository;
    private final ShapeUtility shapeUtility;

    @PostMapping("/createVineyard")
    public ResponseEntity<UserDto> createVineyard(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @RequestBody VineyardRequest vineyardRequest) {
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
        vineyardService.deleteUserVineyard(user);
        return new ResponseEntity<>(userMapper.toUserDto(user), HttpStatus.OK);
    }

    @PostMapping("/validateVineyard")
    public ResponseEntity<Boolean> validateVineyard(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @RequestBody LinkedHashMap<String, Object> polygon) {
        try {
            Polygon createdPolygon = shapeUtility.createPolygon(polygon);
            boolean validated = vineyardRepository.isWithinHungary(createdPolygon);
            return new ResponseEntity<>(validated, HttpStatus.OK);
        } catch (ParseException pe) {
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }
    }
}
