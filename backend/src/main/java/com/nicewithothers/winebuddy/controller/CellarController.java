package com.nicewithothers.winebuddy.controller;

import com.nicewithothers.winebuddy.mapper.UserMapper;
import com.nicewithothers.winebuddy.model.Cellar;
import com.nicewithothers.winebuddy.model.User;
import com.nicewithothers.winebuddy.model.dto.cellar.CellarRequest;
import com.nicewithothers.winebuddy.model.dto.user.UserDto;
import com.nicewithothers.winebuddy.repository.CellarRepository;
import com.nicewithothers.winebuddy.repository.VineyardRepository;
import com.nicewithothers.winebuddy.service.CellarService;
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
@RequestMapping("/api/cellar")
@RequiredArgsConstructor
public class CellarController {
    private final VineyardRepository vineyardRepository;
    private final CellarService cellarService;
    private final UserMapper userMapper;
    private final ShapeUtility shapeUtility;
    private final CellarRepository cellarRepository;

    @PostMapping("/createCellar")
    public ResponseEntity<UserDto> createCellar(@AuthenticationPrincipal User user, @RequestBody CellarRequest cellarRequest) {
        try {
            Cellar cellar = cellarService.createCellar(user.getVineyard(), cellarRequest);
            double area = cellarService.calculateArea(cellar);
            cellar.setArea(area);
            user.getVineyard().getCellars().add(cellar);
            vineyardRepository.save(user.getVineyard());
            return new ResponseEntity<>(userMapper.toUserDto(user), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/deleteCellar/{id}")
    public ResponseEntity<UserDto> deleteCellar(@AuthenticationPrincipal User user, @PathVariable Long id) {
        cellarService.deleteVineyardCellar(id, user.getVineyard());
        return new ResponseEntity<>(userMapper.toUserDto(user), HttpStatus.OK);
    }

    @PostMapping("/validateCellar")
    public ResponseEntity<Boolean> validateCellar(@AuthenticationPrincipal User user, @RequestBody LinkedHashMap<String, Object> polygon) {
        try {
            Polygon createdPolygon = shapeUtility.createPolygon(polygon);
            boolean validated = cellarRepository.isWithinVineyard(createdPolygon, user.getVineyard().getId())
                    && cellarRepository.isNotWithinCellars(createdPolygon)
                    && cellarRepository.isNotWithinGrapevines(createdPolygon);
            return new ResponseEntity<>(validated, HttpStatus.OK);
        } catch (ParseException pe) {
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }
    }
}
