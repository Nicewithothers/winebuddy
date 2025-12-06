package com.nicewithothers.winebuddy.repository;

import com.nicewithothers.winebuddy.model.Grape;
import com.nicewithothers.winebuddy.model.Wine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WineRepository extends JpaRepository<Wine, Long> {
    boolean existsWinesByName(String name);
    Wine getWinesByGrapes(List<Grape> grapes);
    Optional<Wine> findWinesById(Long wineId);
}
