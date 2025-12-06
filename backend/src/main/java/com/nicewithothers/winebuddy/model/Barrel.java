package com.nicewithothers.winebuddy.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.nicewithothers.winebuddy.model.enums.barrel.BarrelSize;
import com.nicewithothers.winebuddy.model.enums.barrel.BarrelType;
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
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "barrel")
@Builder
public class Barrel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double volume;

    @Column(nullable = false)
    private Integer maxVolume;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BarrelType barrelType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BarrelSize barrelSize;

    @Column(nullable = false, updatable = false)
    private Instant owningDate;

    @ManyToOne
    @JsonIgnoreProperties(value = {"barrels", "wines", "grapevines"})
    @JoinColumn(name = "grape_id", referencedColumnName = "id")
    private Grape grape;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "cellar_id", referencedColumnName = "id")
    private Cellar cellar;
}
