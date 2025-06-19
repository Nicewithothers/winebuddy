package com.nicewithothers.winebuddy.service;

import com.nicewithothers.winebuddy.model.Vineyard;
import com.nicewithothers.winebuddy.model.dto.vineyard.VineyardRequest;
import com.nicewithothers.winebuddy.repository.VineyardRepository;
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

@Service
@RequiredArgsConstructor
public class VineyardService {
    private final UserService userService;
    private final VineyardRepository vineyardRepository;

    public Vineyard createVineyard(String username, VineyardRequest vineyardRequest) throws ParseException {
        GeoJsonReader geoJsonReader = new GeoJsonReader();
        String json = new JSONObject(vineyardRequest.getCreatedPolygon()).toString();
        Geometry geometry = geoJsonReader.read(json);

        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        Coordinate[] coords = geometry.getCoordinates();

        LinearRing linearRing = geometryFactory.createLinearRing(coords);
        Polygon polygon = geometryFactory.createPolygon(linearRing);

        if (!vineyardRepository.isWithinHungary(polygon)) {
            throw new ParseException("Vineyard is not within Hungary");
        }

        Vineyard vineyard = Vineyard.builder()
                .name(vineyardRequest.getName())
                .mapArea(polygon)
                .area(0.0)
                .owningDate(Instant.now())
                .owner(userService.findByUsername(username))
                .cellars(null)
                .build();
        return vineyardRepository.save(vineyard);
    }

    public Double calculateArea(Vineyard vineyard) {
        return vineyardRepository.getAreaMeters(vineyard.getMapArea())/1000000;
    }
}
