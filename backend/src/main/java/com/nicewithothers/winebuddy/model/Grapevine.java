package com.nicewithothers.winebuddy.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
import org.locationtech.jts.geom.LineString;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "grapevine")
public class Grapevine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LineString geometry;

    @Column(nullable = false)
    private Double length;

    @Column(nullable = false, updatable = false)
    private Instant created;

    private LocalDateTime grapeDueDate;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "vineyard_id", referencedColumnName = "id")
    private Vineyard vineyard;

    @ManyToOne
    @JsonIgnoreProperties(value = {"barrels", "wines", "grapevines"})
    @JoinColumn(name = "grape_id", referencedColumnName = "id")
    private Grape grape;
}
