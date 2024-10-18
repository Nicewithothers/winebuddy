package com.nicewithothers.winebuddy.models;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Cellar extends BaseLocation {
    private Integer capacity;

    @OneToMany
    private List<Barrel> barrels;
}
