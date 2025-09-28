package com.nicewithothers.winebuddy.service;

import com.nicewithothers.winebuddy.model.Cellar;
import com.nicewithothers.winebuddy.model.Vineyard;
import com.nicewithothers.winebuddy.model.dto.cellar.CellarRequest;
import com.nicewithothers.winebuddy.repository.CellarRepository;
import com.nicewithothers.winebuddy.repository.VineyardRepository;
import com.nicewithothers.winebuddy.utility.ShapeUtility;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.LinearRing;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.geom.PrecisionModel;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.geojson.GeoJsonReader;
import org.springframework.stereotype.Service;

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
        return cellarRepository.getAreaMeters(cellar.getMapArea(), cellar.getId())/100000;
    }

    public void deleteVineyardCellar(Long id, Vineyard vineyard) {
        Cellar cellar = cellarRepository.findCellarById(id).orElse(null);

        if (cellar != null) {
            vineyard.getCellars().remove(cellar);
            vineyardRepository.save(vineyard);
            cellarRepository.delete(cellar);
        }
    }
}
