package com.nicewithothers.winebuddy.model.dto.barrel;

import com.nicewithothers.winebuddy.model.enums.barrel.BarrelSize;
import com.nicewithothers.winebuddy.model.enums.barrel.BarrelType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BarrelRequest {
    private Long cellarId;
    private BarrelSize barrelSize;
    private BarrelType barrelType;
}
