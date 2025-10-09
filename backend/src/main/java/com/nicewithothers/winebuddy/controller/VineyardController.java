package com.nicewithothers.winebuddy.controller;

import com.nicewithothers.winebuddy.mapper.UserMapper;
import com.nicewithothers.winebuddy.model.User;
import com.nicewithothers.winebuddy.model.Vineyard;
import com.nicewithothers.winebuddy.model.dto.user.UserDto;
import com.nicewithothers.winebuddy.model.dto.vineyard.VineyardRequest;
import com.nicewithothers.winebuddy.repository.UserRepository;
import com.nicewithothers.winebuddy.repository.VineyardRepository;
import com.nicewithothers.winebuddy.service.VineyardService;
import com.nicewithothers.winebuddy.utility.ShapeUtility;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.io.ParseException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;

@RestController
@RequestMapping("/api/vineyard")
@RequiredArgsConstructor
public class VineyardController {
    private final UserMapper userMapper;
    private final VineyardService vineyardService;
    private final VineyardRepository vineyardRepository;
    private final ShapeUtility shapeUtility;
    private final UserRepository userRepository;

    @PostMapping("/createVineyard")
    public ResponseEntity<UserDto> createVineyard(@AuthenticationPrincipal User user, @RequestBody VineyardRequest vineyardRequest) {
        try {
            Vineyard vineyard = vineyardService.createVineyard(user, vineyardRequest);
            double area = vineyardService.getArea(vineyard);
            vineyard.setArea(area);
            vineyardRepository.save(vineyard);
            user.setVineyard(vineyard);
            userRepository.save(user);
            return new ResponseEntity<>(userMapper.toUserDto(user), HttpStatus.OK);
        } catch (ParseException pe) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/deleteVineyard/{id}")
    public ResponseEntity<UserDto> deleteVineyard(@PathVariable Long id, @AuthenticationPrincipal User user) {
        vineyardService.deleteUserVineyard(id, user);
        return new ResponseEntity<>(userMapper.toUserDto(user), HttpStatus.OK);
    }

    @PostMapping("/validateVineyard")
    public ResponseEntity<Boolean> validateVineyard(@RequestBody LinkedHashMap<String, Object> polygon) {
        try {
            Polygon createdPolygon = shapeUtility.createPolygon(polygon);
            boolean validated = vineyardRepository.isWithinHungary(createdPolygon);
            return new ResponseEntity<>(validated, HttpStatus.OK);
        } catch (ParseException pe) {
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }
    }
}
