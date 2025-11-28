package com.nicewithothers.winebuddy.service;

import com.nicewithothers.winebuddy.model.Grape;
import com.nicewithothers.winebuddy.model.Grapevine;
import com.nicewithothers.winebuddy.model.Vineyard;
import com.nicewithothers.winebuddy.model.enums.grape.GrapeType;
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
                grapevine.setMature(true);
                grapevineRepository.save(grapevine);
            }
        }
        log.debug("Grapevine maturity check completed with {} changes.", validGrapevines.size());
    }

    public void harvestGrapevine(Long grapevineId) {
        Grapevine grapevine = grapevineRepository.findById(grapevineId).orElseThrow(() -> new RuntimeException("Grapevine not found"));
        grapevine.setGrape(null);
        grapevine.setGrapeDueDate(null);
        grapevine.setMature(false);
        grapevineRepository.save(grapevine);
    }

    public void harvestGrapevinesForUser(Long vineyardId) {
        List<Grapevine> userGrapevines = grapevineRepository.findAll().stream()
                .filter(gv -> gv.getVineyard().getId().equals(vineyardId) && gv.getGrape() != null && gv.isMature())
                .toList();

        for (Grapevine grapevine : userGrapevines) {
            harvestGrapevine(grapevine.getId());
        }
    }
}
