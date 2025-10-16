package com.nicewithothers.winebuddy.service;

import com.nicewithothers.winebuddy.model.Barrel;
import com.nicewithothers.winebuddy.model.Cellar;
import com.nicewithothers.winebuddy.model.dto.barrel.BarrelRequest;
import com.nicewithothers.winebuddy.model.enums.barrel.BarrelSize;
import com.nicewithothers.winebuddy.model.enums.barrel.BarrelType;
import com.nicewithothers.winebuddy.repository.BarrelRepository;
import com.nicewithothers.winebuddy.repository.CellarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class BarrelService {
    private final CellarRepository cellarRepository;
    private final BarrelRepository barrelRepository;

    public Barrel createBarrel(BarrelRequest barrelRequest) {
        Cellar cellar = cellarRepository.findCellarById(barrelRequest.getCellarId()).orElse(null);

        if (cellar != null) {
            Barrel barrel = Barrel.builder()
                    .volume(0)
                    .maxVolume(barrelRequest.getBarrelSize().getValue())
                    .barrelType(BarrelType.valueOf(barrelRequest.getBarrelType().name()))
                    .barrelSize(BarrelSize.valueOf(barrelRequest.getBarrelSize().name()))
                    .owningDate(Instant.now())
                    .cellar(cellar)
                    .grape(null)
                    .build();
            return barrelRepository.save(barrel);
        }
        return null;
    }

    public void deleteCellarBarrel(Long barrelId, Cellar cellar) {
        Barrel currentBarrel = barrelRepository.findBarrelById(barrelId).orElse(null);

        if (currentBarrel != null) {
            cellar.getBarrels().remove(currentBarrel);
            cellarRepository.save(cellar);
            barrelRepository.delete(currentBarrel);
        }
    }
}
