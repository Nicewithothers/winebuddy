package com.nicewithothers.winebuddy.service;

import com.nicewithothers.winebuddy.model.Barrel;
import com.nicewithothers.winebuddy.model.Cellar;
import com.nicewithothers.winebuddy.model.dto.barrel.BarrelRequest;
import com.nicewithothers.winebuddy.model.enums.barrel.BarrelSize;
import com.nicewithothers.winebuddy.model.enums.barrel.BarrelType;
import com.nicewithothers.winebuddy.model.enums.grape.GrapeType;
import com.nicewithothers.winebuddy.repository.BarrelRepository;
import com.nicewithothers.winebuddy.repository.CellarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BarrelService {
    private final CellarRepository cellarRepository;
    private final BarrelRepository barrelRepository;

    public Barrel createBarrel(BarrelRequest barrelRequest) {
        Cellar cellar = cellarRepository.findCellarById(barrelRequest.getCellarId()).orElse(null);

        if (cellar != null) {
            if (cellar.getCapacity() < cellar.getBarrels().size()) {
                throw new RuntimeException("Cellar capacity is max, you can't put more barrels in this cellar.");
            }
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

    public void deleteCellarBarrel(Long barrelId) {
        Barrel barrel = barrelRepository.findBarrelById(barrelId).orElse(null);
        if (barrel != null) {
            Cellar cellar = barrel.getCellar();
            cellar.getBarrels().removeIf(b -> b.getId().equals(barrelId));
            cellarRepository.save(cellar);
        }
    }

    public List<Barrel> getEligibleBarrels(Long cellarId, GrapeType grapeType) {
        Cellar cellar = cellarRepository.findCellarById(cellarId).isPresent() ? cellarRepository.findCellarById(cellarId).get() : null;
        if (cellar != null) {
            List<Barrel> eligibleBarrels = cellar.getBarrels().stream()
                    .filter(b -> b.getGrape() != null && b.getGrape().getGrapeType().equals(grapeType))
                    .sorted(Comparator.comparing(Barrel::getVolume))
                    .toList()
                    .reversed();
            if (eligibleBarrels.isEmpty()) {
                return cellar.getBarrels().stream()
                        .filter(b -> b.getGrape() == null)
                        .sorted(Comparator.comparing(Barrel::getId))
                        .toList();
            }
            return eligibleBarrels;
        }
        return null;
    }
}
