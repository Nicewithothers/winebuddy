package com.nicewithothers.winebuddy.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "cellar")
public class Cellar extends BaseLocation {
    @Column(nullable = false)
    private Integer capacity;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "vineyard_id", referencedColumnName = "id")
    private Vineyard vineyard;

    @JsonManagedReference
    @OneToMany(mappedBy = "cellar", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<Barrel> barrels;
}
