package com.nicewithothers.winebuddy.service;

import com.nicewithothers.winebuddy.model.Barrel;
import com.nicewithothers.winebuddy.model.Cellar;
import com.nicewithothers.winebuddy.model.Grape;
import com.nicewithothers.winebuddy.model.Wine;
import com.nicewithothers.winebuddy.model.dto.wine.WineRequest;
import com.nicewithothers.winebuddy.model.enums.grape.GrapeType;
import com.nicewithothers.winebuddy.repository.BarrelRepository;
import com.nicewithothers.winebuddy.repository.GrapeRepository;
import com.nicewithothers.winebuddy.repository.WineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WineService {
    private final GrapeRepository grapeRepository;
    private final WineRepository wineRepository;
    private final BarrelService barrelService;
    private final BarrelRepository barrelRepository;

    private final Random random = new Random();

    public Wine createOrIncreaseWines(Cellar cellar, WineRequest wineRequest) {
        List<Grape> decodedTypes = Arrays.stream(wineRequest.getGrapeTypes())
                .map(type -> grapeRepository.findByGrapeType(GrapeType.valueOf(type.name())).orElse(null))
                .filter(Objects::nonNull)
                .toList();

        if (wineRepository.existsWinesByName(wineRequest.getName())) {
            Wine wine = wineRepository.getWinesByGrapes(decodedTypes);
            handleVolumes(wine.getId(), wineRequest);
            wine.setQuantity(wine.getQuantity() + wineRequest.getQuantity());
            return wineRepository.save(wine);
        } else {
            Wine wine = Wine.builder()
                    .name(wineRequest.getName())
                    .yearOfCreation(LocalDate.now().getYear())
                    .alcoholPercentage(alcoholGenerator(List.of(wineRequest.getGrapeTypes())))
                    .quantity(wineRequest.getQuantity())
                    .cellar(cellar)
                    .grapes(decodedTypes)
                    .build();
            handleVolumes(wine.getId(), wineRequest);
            return wineRepository.save(wine);
        }
    }

    public Double calculateBottlesVolume(Integer quantity) {
        return quantity.doubleValue() * 0.75; // 0.75l = 1 bottle
    }

    public double generateAlcoholPercentageForGrapeType(GrapeType grapeType) {
        return switch (grapeType) {
            case RIESLING, MUSCAT -> roundToOneDecimal(9.0 + (random.nextDouble() * 3.0)); // 9-12%
            case SAUVIGNON_BLANC -> roundToOneDecimal(11.5 + (random.nextDouble() * 2.5)); // 11.5-14%
            case CHARDONNAY -> roundToOneDecimal(12.5 + (random.nextDouble() * 2.5)); // 12.5-15%
            case PINOT_NOIR -> roundToOneDecimal(12.0 + (random.nextDouble() * 2.5)); // 12-14.5%
            case MERLOT, CABERNET_FRANC -> roundToOneDecimal(13.0 + (random.nextDouble() * 2.5)); // 13-15.5%
            case SYRAH, CABERNET_SAUVIGNON -> roundToOneDecimal(13.5 + (random.nextDouble() * 3.0)); // 13.5-16.5%
            case PORTO -> roundToOneDecimal(19.0 + (random.nextDouble() * 3.0)); // 19-22%
        };
    }

    private double roundToOneDecimal(double value) {
        return Math.round(value * 10.0) / 10.0; // percentage calculator
    }

    public Double alcoholGenerator(List<GrapeType> grapeTypes) {
        if (grapeTypes == null || grapeTypes.isEmpty()) {
            return 12.5; // atlag alkoholszint
        }

        double alcoholSum = grapeTypes.stream()
                .mapToDouble(this::generateAlcoholPercentageForGrapeType)
                .sum();

        return roundToOneDecimal(alcoholSum / grapeTypes.size());
    }

    public void handleVolumes(Long wineId, WineRequest wineRequest) {
        Wine wine = wineRepository.findWinesById(wineId).orElse(null);
        List<GrapeType> grapeTypes = List.of(wineRequest.getGrapeTypes());
        List<Barrel> eligibleWineBarrels = barrelService.getEligibleWineBarrels(wineRequest.getCellarId(), grapeTypes);
        if (wine != null) {
            double calculatedVolume = calculateBottlesVolume(wineRequest.getQuantity());
            double volumePerGrapeTypes = calculatedVolume / grapeTypes.size();

            Map<GrapeType, List<Barrel>> barrelsByGrapeType = eligibleWineBarrels.stream()
                    .collect(Collectors.groupingBy(b -> b.getGrape().getGrapeType()));

            for (int i = 0; i < grapeTypes.size(); i++) {
                GrapeType currentGrapeType = grapeTypes.get(i);
                List<Barrel> currentGrapeTypeBarrels = barrelsByGrapeType.get(currentGrapeType);

                if (currentGrapeTypeBarrels.isEmpty()) {
                    throw new IllegalStateException(String.format("No barrels are available for grapetype %s", currentGrapeType));
                }

                while (volumePerGrapeTypes > 0) {
                    Barrel barrel = currentGrapeTypeBarrels.get(i);
                    double currentBarrelVolume = barrel.getVolume();
                    if (currentBarrelVolume >= volumePerGrapeTypes) {
                        barrel.setVolume(currentBarrelVolume - volumePerGrapeTypes);
                        volumePerGrapeTypes = 0;

                        if (barrel.getVolume() == 0) {
                            barrel.setGrape(null);
                        }
                    } else {
                        volumePerGrapeTypes -= currentBarrelVolume;
                        barrel.setVolume(0.0);
                        barrel.setGrape(null);
                    }
                }
            }

            barrelRepository.saveAll(eligibleWineBarrels);
        }
    }
}
