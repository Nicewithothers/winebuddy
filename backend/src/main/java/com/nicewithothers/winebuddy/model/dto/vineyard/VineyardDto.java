package com.nicewithothers.winebuddy.model.dto.vineyard;

import com.nicewithothers.winebuddy.model.Cellar;
import com.nicewithothers.winebuddy.model.User;
import lombok.Builder;
import lombok.Data;
import org.locationtech.jts.geom.Polygon;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class VineyardDto {
    private Long id;
    private String name;
    private Polygon mapArea;
    private Instant owningDate;
    private Double area;
    private User owner;
    private List<Cellar> cellars;
}
