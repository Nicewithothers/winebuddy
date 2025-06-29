package com.nicewithothers.winebuddy.repository;

import com.nicewithothers.winebuddy.model.Cellar;
import org.locationtech.jts.geom.Polygon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CellarRepository extends JpaRepository<Cellar, Long> {
    @Query(value = """
            select st_within(:mapArea, v.map_area)
            from vineyard v
            where v.id = :vineyardId
            """, nativeQuery = true)
    Boolean isWithinVineyard(@Param("mapArea") Polygon mapArea, @Param("vineyardId") Long vineyardId);

    @Query(value= """
            select not exists (
            	select 1
            	from cellar c
            	where st_intersects(:cellarGeom, c.map_area)
            );
            """, nativeQuery = true)
    Boolean isNotWithinCellars(@Param("cellarGeom") Polygon cellarGeom);

    @Query(value = """
            select st_area(cast(:mapArea as geography))
            from cellar c
            where c.id = :cellarId
            """, nativeQuery = true)
    Double getAreaMeters(@Param("mapArea") Polygon mapArea, @Param("cellarId") Long cellarId);

    Optional<Cellar> findCellarById(Long id);
}
