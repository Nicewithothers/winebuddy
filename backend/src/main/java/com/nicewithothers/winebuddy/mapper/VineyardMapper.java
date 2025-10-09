package com.nicewithothers.winebuddy.mapper;

import com.nicewithothers.winebuddy.config.MapstructConfig;
import com.nicewithothers.winebuddy.model.Vineyard;
import com.nicewithothers.winebuddy.model.dto.vineyard.VineyardDto;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(config = MapstructConfig.class, uses = UserMapper.class)
public interface VineyardMapper {
    VineyardDto toVineyardDto(Vineyard vineyard);
    List<VineyardDto> toVineyardDtos(List<Vineyard> vineyards);
}
