package com.nicewithothers.winebuddy.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.nicewithothers.winebuddy.model.enums.GrapeTaste;
import com.nicewithothers.winebuddy.model.enums.GrapeType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "grape")
public class Grape {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GrapeType grapeType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GrapeTaste grapeTaste;

    @JsonManagedReference
    @OneToMany(mappedBy = "grape", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Barrel> barrels;
}
