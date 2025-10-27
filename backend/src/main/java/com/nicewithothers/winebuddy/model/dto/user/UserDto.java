package com.nicewithothers.winebuddy.model.dto.user;

import com.nicewithothers.winebuddy.model.Vineyard;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private String username;
    private String email;
    private Instant created;
    private String profileURL;
    private Vineyard vineyard;
}
