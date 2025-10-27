package com.nicewithothers.winebuddy.model.dto.grapevine;

import com.nicewithothers.winebuddy.model.enums.grape.GrapeType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GrapevineRequest {
    private GrapeType grapeType;
}
