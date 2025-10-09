package com.nicewithothers.winebuddy.model.dto.barrel;

import com.nicewithothers.winebuddy.model.enums.barrel.BarrelSize;
import com.nicewithothers.winebuddy.model.enums.barrel.BarrelType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BarrelDto {
    private Double volume;
    private Double maxVolume;
    private BarrelType barrelType;
    private BarrelSize barrelSize;
}