package com.nicewithothers.winebuddy.repository;

import com.nicewithothers.winebuddy.model.Grape;
import com.nicewithothers.winebuddy.model.enums.grape.GrapeType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GrapeRepository extends JpaRepository<Grape, Long> {
    Optional<Grape> findByGrapeType(GrapeType grapeType);
}
