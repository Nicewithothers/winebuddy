package com.nicewithothers.winebuddy.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "wine")
public class Wine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer yearOfCreation;

    @Column(nullable = false)
    private Double alcoholPercentage;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "vineyard_id", referencedColumnName = "id")
    private Vineyard vineyard;

    @JsonManagedReference
    @ManyToMany
    @JoinTable(
            name = "wine_grape",
            joinColumns = @JoinColumn(name = "wine_id"),
            inverseJoinColumns = @JoinColumn(name = "grape_id")
    )
    private List<Grape> grapes;
}
