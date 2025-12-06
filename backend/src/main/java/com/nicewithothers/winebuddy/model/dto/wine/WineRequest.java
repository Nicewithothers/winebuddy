package com.nicewithothers.winebuddy.model.dto.wine;

import com.nicewithothers.winebuddy.model.enums.grape.GrapeType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WineRequest {
    private String name;
    private GrapeType[] grapeTypes;
    private Integer quantity;
    private Long cellarId;
}
