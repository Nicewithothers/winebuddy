package com.nicewithothers.winebuddy.service;

import com.nicewithothers.winebuddy.model.Grape;
import com.nicewithothers.winebuddy.model.Grapevine;
import com.nicewithothers.winebuddy.model.Vineyard;
import com.nicewithothers.winebuddy.model.dto.grapevine.GrapevineRequest;
import com.nicewithothers.winebuddy.model.enums.grape.GrapeType;
import com.nicewithothers.winebuddy.repository.GrapeRepository;
import com.nicewithothers.winebuddy.repository.GrapevineRepository;
import com.nicewithothers.winebuddy.repository.VineyardRepository;
import com.nicewithothers.winebuddy.utility.ShapeUtility;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.io.ParseException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;

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

}
