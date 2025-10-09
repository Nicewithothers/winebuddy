package com.nicewithothers.winebuddy.mapper;

import com.nicewithothers.winebuddy.config.MapstructConfig;
import com.nicewithothers.winebuddy.model.Cellar;
import com.nicewithothers.winebuddy.model.dto.cellar.CellarDto;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(config = MapstructConfig.class, uses = UserMapper.class)
public interface CellarMapper {
    CellarDto toCellarDto(Cellar cellar);
    List<CellarDto> toCellarDtos(List<Cellar> cellars);
}
