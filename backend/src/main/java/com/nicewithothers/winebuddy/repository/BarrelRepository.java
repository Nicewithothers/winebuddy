package com.nicewithothers.winebuddy.repository;

import com.nicewithothers.winebuddy.model.Barrel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BarrelRepository extends JpaRepository<Barrel, Long> {
    Optional<Barrel> findBarrelById(Long id);
}
