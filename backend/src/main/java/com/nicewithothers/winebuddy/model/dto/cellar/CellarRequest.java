package com.nicewithothers.winebuddy.model.dto.cellar;

import lombok.Builder;
import lombok.Data;

import java.util.LinkedHashMap;

@Data
@Builder
public class CellarRequest {
    private String name;
    private Integer capacity;
    private LinkedHashMap<String, Object> createdPolygon;
}
