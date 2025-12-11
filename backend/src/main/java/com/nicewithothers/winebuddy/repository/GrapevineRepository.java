package com.nicewithothers.winebuddy.repository;

import com.nicewithothers.winebuddy.model.Grapevine;
import org.locationtech.jts.geom.LineString;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface GrapevineRepository extends JpaRepository<Grapevine, Long> {
    @Query(value = """
            select st_within(:mapArea, v.map_area)
            from vineyard v
            where v.id = :vineyardId
            """, nativeQuery = true)
    Boolean isWithinVineyard(@Param("mapArea") LineString mapArea, @Param("vineyardId") Long vineyardId);

    @Query(value= """
            select not exists (
            	select 1
            	from cellar c
            	where st_intersects(:grapevineArea, c.map_area)
            );
            """, nativeQuery = true)
    Boolean isNotWithinCellars(@Param("grapevineArea") LineString grapevineArea);

    @Query(value= """
            select not exists (
            	select 1
            	from grapevine gv
            	where st_intersects(:grapevineArea, gv.geometry)
            );
            """, nativeQuery = true)
    Boolean isNotIntersects(@Param("grapevineArea") LineString grapevineArea);

    @Query(value = """
        select st_length((:grapevineArea)::geography)
        from grapevine gv
        where gv.id = :grapevineId
        """, nativeQuery = true)
    Double getGrapevineLength(@Param("grapevineArea") LineString grapevineArea, @Param("grapevineId") Long grapevineId);

    Optional<Grapevine> findById(long id);
}
