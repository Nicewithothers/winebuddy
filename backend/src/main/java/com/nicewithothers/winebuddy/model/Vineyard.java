package com.nicewithothers.winebuddy.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "vineyard")
public class Vineyard extends BaseLocation {
    @Column(nullable = false)
    private Double area;

    @OneToOne(mappedBy = "vineyard")
    private User owner;

    @OneToMany(mappedBy = "vineyard", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Cellar> cellars;
}
