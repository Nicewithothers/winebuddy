package com.nicewithothers.winebuddy.controller;

import com.nicewithothers.winebuddy.mapper.UserMapper;
import com.nicewithothers.winebuddy.model.Cellar;
import com.nicewithothers.winebuddy.model.User;
import com.nicewithothers.winebuddy.model.Wine;
import com.nicewithothers.winebuddy.model.dto.user.UserDto;
import com.nicewithothers.winebuddy.model.dto.wine.WineRequest;
import com.nicewithothers.winebuddy.repository.CellarRepository;
import com.nicewithothers.winebuddy.service.WineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/wine")
@RequiredArgsConstructor
public class WineController {
    private final WineService wineService;
    private final CellarRepository cellarRepository;
    private final UserMapper userMapper;

    @PostMapping("/createWines")
    public ResponseEntity<UserDto> createWines(@AuthenticationPrincipal User user, @RequestBody WineRequest wineRequest) {
        try {
            Cellar cellar = cellarRepository.getCellarById(wineRequest.getCellarId());
            Wine wine = wineService.createOrIncreaseWines(cellar, wineRequest);
            cellar.getWines().add(wine);
            cellarRepository.save(cellar);
            return new ResponseEntity<>(userMapper.toUserDto(user), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
