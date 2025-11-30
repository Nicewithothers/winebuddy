package com.nicewithothers.winebuddy.service;

import com.nicewithothers.winebuddy.model.Barrel;
import com.nicewithothers.winebuddy.model.Grape;
import com.nicewithothers.winebuddy.model.Grapevine;
import com.nicewithothers.winebuddy.model.Vineyard;
import com.nicewithothers.winebuddy.model.dto.grapevine.GrapevineHarvestRequest;
import com.nicewithothers.winebuddy.model.enums.grape.GrapeType;
import com.nicewithothers.winebuddy.repository.BarrelRepository;
import com.nicewithothers.winebuddy.repository.GrapeRepository;
import com.nicewithothers.winebuddy.repository.GrapevineRepository;
import com.nicewithothers.winebuddy.repository.VineyardRepository;
import com.nicewithothers.winebuddy.utility.ShapeUtility;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.io.ParseException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GrapevineService {
    private final GrapevineRepository grapevineRepository;
    private final ShapeUtility shapeUtility;
    private final VineyardRepository vineyardRepository;
    private final GrapeRepository grapeRepository;
    private final BarrelService barrelService;
    private final BarrelRepository barrelRepository;

    public Grapevine createGrapevine(Vineyard vineyard, LinkedHashMap<String, Object> createdLinestring) throws ParseException {
        LineString lineString = shapeUtility.createLineString(createdLinestring);

        Grapevine grapevine = Grapevine.builder()
                .geometry(lineString)
                .length(0.0)
                .created(Instant.now())
                .isMature(false)
                .grapeDueDate(null)
                .grape(null)
                .vineyard(vineyardRepository.getReferenceById(vineyard.getId()))
                .build();

        return grapevineRepository.save(grapevine);
    }

    public Double calculateGrapevineLength(Grapevine grapevine) {
        return grapevineRepository.getGrapevineLength(grapevine.getGeometry(), grapevine.getId())/1000; // m -> km
    }

    public void setGrapeToGrapevine(Long id, String grapeType) {
        Grape grape = grapeRepository.findByGrapeType(GrapeType.valueOf(grapeType)).orElseThrow();
        Grapevine grapevine = grapevineRepository.findById(id).orElseThrow(() -> new RuntimeException("Grapevine not found"));

        grapevine.setGrape(grape);
        grapevine.setGrapeDueDate(LocalDateTime.now().plusMonths(grape.getGrapeGrowthTime()));
        grapevineRepository.save(grapevine);
    }

    public void deleteGrapevine(Long id, Vineyard vineyard) {
        Grapevine grapevine = grapevineRepository.findById(id).orElse(null);

        if (grapevine != null) {
            vineyard.getGrapevines().removeIf(gv -> gv.getId().equals(id));
            vineyardRepository.save(vineyard);
            grapevineRepository.delete(grapevine);
        }
    }

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void checkGrapevines() {
        List<Grapevine> validGrapevines = grapevineRepository.findAll().stream()
                .filter(gv -> gv.getGrape() != null)
                .toList();
        LocalDateTime now = LocalDateTime.now();

        for (Grapevine grapevine : validGrapevines) {
            if (now.isAfter(grapevine.getGrapeDueDate())) {
                grapevine.setIsMature(true);
                grapevineRepository.save(grapevine);
            }
        }
        log.debug("Grapevine maturity check completed with {} changes.", validGrapevines.size());
    }

    public Integer calculateGrapeVolume(Grapevine grapevine) {
        return (int) Math.ceil(((grapevine.getLength() * 1000) / 2) * 5); // km -> m, vines 2 meter spacing, 5 kg per vine.
    }

    public void harvestGrapevine(Long grapevineId, GrapevineHarvestRequest harvestRequest) throws Exception {
        Grapevine grapevine = grapevineRepository.findById(grapevineId).orElseThrow(() -> new RuntimeException("Grapevine not found"));
        List<Barrel> fillableBarrels = barrelService.getEligibleBarrels(harvestRequest.getCellarId(), harvestRequest.getGrapeType());
        int fillableBarrelVolume = fillableBarrels.stream()
                .mapToInt(barrel -> barrel.getMaxVolume() - barrel.getVolume())
                .sum();
        int harvestedGrapeVolume = calculateGrapeVolume(grapevine);
        if (harvestedGrapeVolume > fillableBarrelVolume) {
            throw new Exception("Not enough space in barrels to harvest the grapes.");
        }

        while (harvestedGrapeVolume > 0) {
            for (Barrel barrel : fillableBarrels) {
                int availableVolume = barrel.getMaxVolume() - barrel.getVolume();
                if (availableVolume > 0) {
                    if (harvestedGrapeVolume <= availableVolume) {
                        barrel.setVolume(barrel.getVolume() + harvestedGrapeVolume);
                        harvestedGrapeVolume = 0;
                    } else {
                        barrel.setVolume(barrel.getMaxVolume());
                        harvestedGrapeVolume -= availableVolume;
                    }
                    barrel.setGrape(grapevine.getGrape());
                    barrelRepository.save(barrel);
                }
                if (harvestedGrapeVolume == 0) {
                    break;
                }
            }
        }

        grapevine.setGrape(null);
        grapevine.setGrapeDueDate(null);
        grapevine.setIsMature(false);
        grapevineRepository.save(grapevine);
    }

    public void harvestGrapevinesForUser(Long vineyardId, GrapevineHarvestRequest harvestRequest) throws Exception {
        List<Grapevine> userGrapevines = grapevineRepository.findAll().stream()
                .filter(gv -> gv.getVineyard().getId().equals(vineyardId) && gv.getGrape() != null && gv.getIsMature())
                .toList();

        for (Grapevine grapevine : userGrapevines) {
            harvestGrapevine(grapevine.getId(), harvestRequest);
        }
    }
}
