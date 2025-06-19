package com.nicewithothers.winebuddy.model.dto.vineyard;

import lombok.Data;
import java.util.LinkedHashMap;

@Data
public class VineyardRequest {
    private String name;
    private LinkedHashMap<String, Object> createdPolygon;
}
