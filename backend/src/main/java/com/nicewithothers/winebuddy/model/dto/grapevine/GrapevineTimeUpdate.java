package com.nicewithothers.winebuddy.model.dto.grapevine;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class GrapevineTimeUpdate {
    private Long id;
    private String name;
    private String timeRemaining;
    private boolean isMature;
    private LocalDateTime maturityDate;
    private double progressPercentage;
}
