package com.nicewithothers.winebuddy.model.dto.vineyard;

import com.nicewithothers.winebuddy.model.dto.cellar.CellarDto;
import com.nicewithothers.winebuddy.model.dto.user.UserDto;
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
    private UserDto owner;
    private List<CellarDto> cellars;
}
