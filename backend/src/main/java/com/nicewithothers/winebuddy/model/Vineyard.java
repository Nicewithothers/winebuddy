package com.nicewithothers.winebuddy.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
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
@Table(name = "vineyard")
public class Vineyard extends BaseLocation {
    @JsonBackReference
    @OneToOne(mappedBy = "vineyard")
    private User owner;

    @JsonManagedReference
    @OneToMany(mappedBy = "vineyard", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<Cellar> cellars;

    @JsonManagedReference
    @OneToMany(mappedBy = "vineyard", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<Grapevine> grapevines;

    @JsonManagedReference
    @OneToMany(mappedBy = "vineyard", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<Wine> wines;
}
