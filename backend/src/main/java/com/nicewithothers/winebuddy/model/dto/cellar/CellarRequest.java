package com.nicewithothers.winebuddy.model.dto.cellar;

import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

import java.util.LinkedHashMap;

@Data
@Builder
public class CellarRequest {
    @Size(max = 6, message = "Name should have a maximum size of 6!")
    private String name;
    private Integer capacity;
    private LinkedHashMap<String, Object> createdPolygon;
}
