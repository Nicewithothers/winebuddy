package com.nicewithothers.winebuddy.model.dto.vineyard;

import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.LinkedHashMap;

@Data
public class VineyardRequest {
    @Size(max = 6, message = "Name should be a maximum size of 6!")
    private String name;
    private LinkedHashMap<String, Object> createdPolygon;
}
