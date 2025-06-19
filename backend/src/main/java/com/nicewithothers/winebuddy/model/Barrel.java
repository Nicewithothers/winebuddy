package com.nicewithothers.winebuddy.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "geometry", nullable = false)
    private Point location;

    @Column(nullable = false)
    private Double volume;

    @ManyToOne
    @JoinColumn(name = "grape_id", referencedColumnName = "id")
    private Grape grape;

    @ManyToOne
    @JoinColumn(name = "cellar_id", referencedColumnName = "id")
    private Cellar cellar;
}
