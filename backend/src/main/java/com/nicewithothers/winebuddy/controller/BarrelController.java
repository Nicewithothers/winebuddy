package com.nicewithothers.winebuddy.controller;

import com.nicewithothers.winebuddy.mapper.UserMapper;
import com.nicewithothers.winebuddy.model.Barrel;
import com.nicewithothers.winebuddy.model.Cellar;
import com.nicewithothers.winebuddy.model.User;
import com.nicewithothers.winebuddy.model.dto.barrel.BarrelRequest;
import com.nicewithothers.winebuddy.model.dto.user.UserDto;
import com.nicewithothers.winebuddy.repository.CellarRepository;
import com.nicewithothers.winebuddy.repository.UserRepository;
import com.nicewithothers.winebuddy.service.BarrelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/barrel")
public class BarrelController {
    private final BarrelService barrelService;
    private final CellarRepository cellarRepository;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @PostMapping("/createBarrel")
    public ResponseEntity<UserDto> createBarrel(@AuthenticationPrincipal User user,
                                                @RequestBody BarrelRequest barrelRequest) {
        try {
            Barrel barrel = barrelService.createBarrel(barrelRequest);
            Cellar currentCellar = user.getVineyard().getCellars().stream()
                    .filter(c -> Objects.equals(c.getId(), barrel.getCellar().getId()))
                    .findFirst()
                    .orElseThrow();
            currentCellar.getBarrels().add(barrel);
            cellarRepository.save(currentCellar);
            //userRepository.save(user);
            return new ResponseEntity<>(userMapper.toUserDto(user), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
