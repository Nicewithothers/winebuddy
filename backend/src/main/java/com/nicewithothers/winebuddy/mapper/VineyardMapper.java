package com.nicewithothers.winebuddy.mapper;

import com.nicewithothers.winebuddy.config.MapstructConfig;
import com.nicewithothers.winebuddy.model.Vineyard;
import com.nicewithothers.winebuddy.model.dto.vineyard.VineyardDto;
import org.locationtech.jts.geom.Polygon;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.data.domain.Page;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Mapper(config = MapstructConfig.class, uses = {UserMapper.class})
public interface VineyardMapper {
    VineyardDto toVineyardDto(Vineyard vineyard);
    List<VineyardDto> toVineyardDtos(List<Vineyard> vineyards);
    default Page<VineyardDto> toVineyardDtos(Page<Vineyard> pages) {
        return pages.map(this::toVineyardDto);
    }
}
