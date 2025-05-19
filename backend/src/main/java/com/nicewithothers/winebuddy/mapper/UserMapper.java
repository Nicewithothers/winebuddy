package com.nicewithothers.winebuddy.mapper;

import com.nicewithothers.winebuddy.config.MapstructConfig;
import com.nicewithothers.winebuddy.model.User;
import com.nicewithothers.winebuddy.model.dto.user.UserDto;
import org.mapstruct.Mapper;
import org.springframework.data.domain.Page;

import java.util.List;

@Mapper(config = MapstructConfig.class)
public interface UserMapper {
    UserDto toUserDto(User user);
    List<UserDto> usersToUserDtos(List<User> users);
    default Page<UserDto> toUserDtos(Page<User> users) {
        return users.map(this::toUserDto);
    }
}
