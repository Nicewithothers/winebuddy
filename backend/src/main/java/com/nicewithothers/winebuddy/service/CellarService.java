package com.nicewithothers.winebuddy.service;

import com.nicewithothers.winebuddy.model.Cellar;
import com.nicewithothers.winebuddy.model.Vineyard;
import com.nicewithothers.winebuddy.model.dto.cellar.CellarRequest;
import com.nicewithothers.winebuddy.repository.CellarRepository;
import com.nicewithothers.winebuddy.repository.VineyardRepository;
import com.nicewithothers.winebuddy.utility.ShapeUtility;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.io.ParseException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CellarService {
    private final CellarRepository cellarRepository;
    private final VineyardRepository vineyardRepository;
    private final ShapeUtility shapeUtility;

    public Cellar createCellar(Vineyard vineyard, CellarRequest cellarRequest) throws ParseException {
        Polygon polygon = shapeUtility.createPolygon(cellarRequest.getCreatedPolygon());

        Cellar cellar = Cellar.builder()
                .name(cellarRequest.getName())
                .mapArea(polygon)
                .area(0.0)
                .capacity(cellarRequest.getCapacity())
                .owningDate(Instant.now())
                .vineyard(vineyardRepository.getReferenceById(vineyard.getId()))
                .barrels(Collections.emptyList())
                .build();
        return cellarRepository.save(cellar);
    }

    public Double calculateArea(Cellar cellar) {
        return cellarRepository.getAreaMeters(cellar.getMapArea(), cellar.getId())/100000; // m² -> km²
    }

    public void deleteVineyardCellar(Long id, Vineyard vineyard) {
        vineyard.getCellars().removeIf(c -> c.getId().equals(id));
        vineyardRepository.save(vineyard);
    }
}
