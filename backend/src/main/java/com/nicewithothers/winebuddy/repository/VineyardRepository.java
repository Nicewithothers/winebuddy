package com.nicewithothers.winebuddy.repository;

import com.nicewithothers.winebuddy.model.Vineyard;
import org.locationtech.jts.geom.Polygon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface VineyardRepository extends JpaRepository<Vineyard, Long> {
    @Query(value = """
            SELECT st_within(:mapArea, h.geom)
                        from hungary h
                        limit 1;
            """, nativeQuery = true)
    Boolean isWithinHungary(@Param("mapArea") Polygon mapArea);

    @Query(value = """
            SELECT st_area(cast(:mapArea as geography))
                        from vineyard v
                        limit 1;
            """, nativeQuery = true)
    Double getAreaMeters(@Param("mapArea") Polygon mapArea);

    Vineyard getVineyardById(Long id);

    void removeVineyardById(Long id);
}
