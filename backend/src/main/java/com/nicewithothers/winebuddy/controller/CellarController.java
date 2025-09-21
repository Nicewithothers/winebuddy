package com.nicewithothers.winebuddy.controller;

import com.nicewithothers.winebuddy.mapper.UserMapper;
import com.nicewithothers.winebuddy.model.Cellar;
import com.nicewithothers.winebuddy.model.User;
import com.nicewithothers.winebuddy.model.dto.cellar.CellarRequest;
import com.nicewithothers.winebuddy.model.dto.user.UserDto;
import com.nicewithothers.winebuddy.repository.CellarRepository;
import com.nicewithothers.winebuddy.repository.UserRepository;
import com.nicewithothers.winebuddy.repository.VineyardRepository;
import com.nicewithothers.winebuddy.service.CellarService;
import com.nicewithothers.winebuddy.service.UserService;
import com.nicewithothers.winebuddy.utility.JwtUtility;
import com.nicewithothers.winebuddy.utility.ShapeUtility;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Polygon;
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

import java.util.LinkedHashMap;

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
    private final ShapeUtility shapeUtility;
    private final CellarRepository cellarRepository;

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

    @DeleteMapping("/deleteCellar/{id}")
    public ResponseEntity<UserDto> deleteCellar(@PathVariable Long id, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        String username = jwtUtility.extractUsername(token);
        User user = userService.findByUsername(username);
        cellarService.deleteVineyardCellar(id, user.getVineyard());
        return new ResponseEntity<>(userMapper.toUserDto(user), HttpStatus.OK);
    }

    @PostMapping("/validateCellar")
    public ResponseEntity<Boolean> validateCellar(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @RequestBody LinkedHashMap<String, Object> polygon) {
        try {
            String username = jwtUtility.extractUsername(token);
            User user = userService.findByUsername(username);
            Polygon createdPolygon = shapeUtility.createPolygon(polygon);
            boolean validated = cellarRepository.isWithinVineyard(createdPolygon, user.getVineyard().getId())
                    && cellarRepository.isNotWithinCellars(createdPolygon);
            return new ResponseEntity<>(validated, HttpStatus.OK);
        } catch (ParseException pe) {
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }
    }
}
