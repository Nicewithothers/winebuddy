package com.nicewithothers.winebuddy.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.nicewithothers.winebuddy.model.enums.BarrelSize;
import com.nicewithothers.winebuddy.model.enums.BarrelType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.Point;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "barrel")
public class Barrel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "Geometry(Point,4326)", nullable = false)
    private Point location;

    @Column(nullable = false)
    private Double volume;

    @Column(nullable = false)
    private Double maxVolume;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BarrelType barrelType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BarrelSize barrelSize;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "grape_id", referencedColumnName = "id")
    private Grape grape;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "cellar_id", referencedColumnName = "id")
    private Cellar cellar;
}
