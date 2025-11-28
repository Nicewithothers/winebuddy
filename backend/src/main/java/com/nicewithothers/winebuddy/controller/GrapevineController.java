package com.nicewithothers.winebuddy.controller;

import com.nicewithothers.winebuddy.mapper.UserMapper;
import com.nicewithothers.winebuddy.model.Grapevine;
import com.nicewithothers.winebuddy.model.User;
import com.nicewithothers.winebuddy.model.dto.user.UserDto;
import com.nicewithothers.winebuddy.repository.GrapevineRepository;
import com.nicewithothers.winebuddy.repository.UserRepository;
import com.nicewithothers.winebuddy.repository.VineyardRepository;
import com.nicewithothers.winebuddy.service.GrapevineService;
import com.nicewithothers.winebuddy.utility.ShapeUtility;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.io.ParseException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;

@RestController
@RequestMapping("/api/grapevine")
@RequiredArgsConstructor
public class GrapevineController {
    private final GrapevineService grapevineService;
    private final UserMapper userMapper;
    private final ShapeUtility shapeUtility;
    private final GrapevineRepository grapevineRepository;
    private final VineyardRepository vineyardRepository;
    private final UserRepository userRepository;

    @PostMapping("/createGrapevine")
    public ResponseEntity<UserDto> createGrapevine(@AuthenticationPrincipal User user, @RequestBody LinkedHashMap<String, Object> createdLinestring) {
        try {
            Grapevine grapevine = grapevineService.createGrapevine(user.getVineyard(), createdLinestring);
            double length = grapevineService.calculateGrapevineLength(grapevine);
            grapevine.setLength(length);
            grapevineRepository.save(grapevine);
            user.getVineyard().getGrapevines().add(grapevine);
            vineyardRepository.save(user.getVineyard());
            return new ResponseEntity<>(userMapper.toUserDto(user), HttpStatus.OK);
        } catch (ParseException pse) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/validateGrapevine")
    public ResponseEntity<Boolean> validateGrapevine(@AuthenticationPrincipal User user, @RequestBody LinkedHashMap<String, Object> createdLinestring) {
        try {
            LineString lineString = shapeUtility.createLineString(createdLinestring);
            boolean isValidated = grapevineRepository.isWithinVineyard(lineString, user.getVineyard().getId()) &&
                    grapevineRepository.isNotIntersects(lineString) &&
                    grapevineRepository.isNotWithinCellars(lineString);
            return new ResponseEntity<>(isValidated, HttpStatus.OK);
        } catch (ParseException pse) {
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping("/setGrapeToGrapevine/{id}")
    public ResponseEntity<UserDto> setGrapeToGrapevine(@PathVariable Long id,
                                                       @AuthenticationPrincipal User user,
                                                       @RequestBody String grapeType) {
        grapevineService.setGrapeToGrapevine(id, grapeType);
        User updatedUser = userRepository.findById(user.getId()).orElseThrow();
        return new ResponseEntity<>(userMapper.toUserDto(updatedUser), HttpStatus.OK);
    }

    @DeleteMapping("/deleteGrapevine/{id}")
    public ResponseEntity<UserDto> deleteGrapevine(@PathVariable Long id,
                                                    @AuthenticationPrincipal User user) {
        grapevineService.deleteGrapevine(id, user.getVineyard());
        User updatedUser = userRepository.findById(user.getId()).orElseThrow();
        return new ResponseEntity<>(userMapper.toUserDto(updatedUser), HttpStatus.OK);
    }

    @PostMapping("/harvestGrapevine/{id}")
    public ResponseEntity<UserDto> harvestGrapevine(@PathVariable Long id,
                                                    @AuthenticationPrincipal User user) {
        grapevineService.harvestGrapevine(id);
        return null;
    }
}
