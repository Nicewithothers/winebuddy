package com.nicewithothers.winebuddy.model.dto.cellar;

import com.nicewithothers.winebuddy.model.dto.barrel.BarrelDto;
import com.nicewithothers.winebuddy.model.dto.vineyard.VineyardDto;
import lombok.Builder;
import lombok.Data;
import org.locationtech.jts.geom.Polygon;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class CellarDto {
    private Long id;
    private String name;
    private Polygon mapArea;
    private Double area;
    private Instant owningDate;
    private Integer capacity;
    private VineyardDto vineyard;
    private List<BarrelDto> barrels;
}
