package com.nicewithothers.winebuddy.utility;

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

import java.util.LinkedHashMap;

@Service
public class ShapeUtility {
    public Polygon createPolygon(LinkedHashMap<String, Object> polygon) throws ParseException {
        GeoJsonReader geoJsonReader = new GeoJsonReader();
        String json = new JSONObject(polygon).toString();
        Geometry geometry = geoJsonReader.read(json);

        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        Coordinate[] coords = geometry.getCoordinates();

        LinearRing linearRing = geometryFactory.createLinearRing(coords);
        return geometryFactory.createPolygon(linearRing);
    }
}
