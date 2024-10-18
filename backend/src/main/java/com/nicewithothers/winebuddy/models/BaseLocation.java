package com.nicewithothers.winebuddy.models;

import io.github.sebasbaumh.postgis.Polygon;
import jakarta.annotation.Nullable;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@MappedSuperclass
public abstract class BaseLocation {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    @Nullable
    private Polygon mapArea;

    @Nullable
    private LocalDateTime owningDate;
}
