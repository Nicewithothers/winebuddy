package com.nicewithothers.winebuddy.utility;

import org.json.simple.JSONObject;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.geom.LinearRing;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.geom.PrecisionModel;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.geojson.GeoJsonReader;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;

@Component
public class ShapeUtility {
    public Polygon createPolygon(LinkedHashMap<String, Object> polygon) throws ParseException {
        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        Coordinate[] coords = handleCoords(polygon);
        LinearRing linearRing = geometryFactory.createLinearRing(coords);
        return geometryFactory.createPolygon(linearRing);
    }

    public LineString createLineString(LinkedHashMap<String, Object> lineString) throws ParseException {
        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        Coordinate[] coords = handleCoords(lineString);
        return geometryFactory.createLineString(coords);
    }

    private static Coordinate[] handleCoords(LinkedHashMap<String, Object> inCoords) throws ParseException {
        GeoJsonReader geoJsonReader = new GeoJsonReader();
        String json = new JSONObject(inCoords).toString();
        Geometry geometry = geoJsonReader.read(json);
        return geometry.getCoordinates();
    }
}
