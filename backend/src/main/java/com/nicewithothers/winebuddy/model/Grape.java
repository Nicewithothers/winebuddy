package com.nicewithothers.winebuddy.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.nicewithothers.winebuddy.model.enums.grape.GrapeColor;
import com.nicewithothers.winebuddy.model.enums.grape.GrapeTaste;
import com.nicewithothers.winebuddy.model.enums.grape.GrapeType;
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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GrapeColor grapeColor;

    @JsonManagedReference
    @OneToMany(mappedBy = "grape", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Barrel> barrels;
}
