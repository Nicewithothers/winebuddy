package com.nicewithothers.winebuddy.model.enums.barrel;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum BarrelSize {
    SMALL(225),
    MEDIUM(500),
    LARGE(1000);

    private final Integer value;
}
