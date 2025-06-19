package com.nicewithothers.winebuddy.model;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.locationtech.jts.geom.Polygon;

import java.time.Instant;

@Data
@NoArgsConstructor
@SuperBuilder
@MappedSuperclass
public abstract class BaseLocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "Geometry(Polygon,4326)", nullable = false)
    private Polygon mapArea;

    @Column(nullable = false)
    private Instant owningDate = Instant.now();
}
