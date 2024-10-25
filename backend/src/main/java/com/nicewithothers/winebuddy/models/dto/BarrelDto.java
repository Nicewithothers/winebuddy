package com.nicewithothers.winebuddy.models.dto;


import io.github.sebasbaumh.postgis.Point;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BarrelDto {
    private String name;
    private Point location;
    private Double volume;
}
