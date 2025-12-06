package com.nicewithothers.winebuddy.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.nicewithothers.winebuddy.model.enums.grape.GrapeColor;
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
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Immutable
@Table(name = "grape")
public class Grape {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GrapeType grapeType;

    @Column(nullable = false)
    private Double grapeSweetness;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GrapeColor grapeColor;

    @Column(nullable = false)
    private Integer grapeGrowthTime;

    @JsonIgnore
    @OneToMany(mappedBy = "grape", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Barrel> barrels;

    @JsonIgnore
    @OneToMany(mappedBy = "grape", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Grapevine> grapevines;

    @JsonBackReference
    @ManyToMany(mappedBy = "grapes")
    private List<Wine> wines;
}
