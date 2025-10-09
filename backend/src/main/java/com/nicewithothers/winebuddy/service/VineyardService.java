package com.nicewithothers.winebuddy.service;

import com.nicewithothers.winebuddy.model.User;
import com.nicewithothers.winebuddy.model.Vineyard;
import com.nicewithothers.winebuddy.model.dto.vineyard.VineyardRequest;
import com.nicewithothers.winebuddy.repository.UserRepository;
import com.nicewithothers.winebuddy.repository.VineyardRepository;
import com.nicewithothers.winebuddy.utility.ShapeUtility;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.io.ParseException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class VineyardService {
    private final UserRepository userRepository;
    private final VineyardRepository vineyardRepository;
    private final ShapeUtility shapeUtility;
    private final UserService userService;

    public Vineyard createVineyard(User user, VineyardRequest vineyardRequest) throws ParseException {
        Polygon polygon = shapeUtility.createPolygon(vineyardRequest.getCreatedPolygon());

        Vineyard vineyard = Vineyard.builder()
                .name(vineyardRequest.getName())
                .mapArea(polygon)
                .area(0.0)
                .owningDate(Instant.now())
                .owner(userService.findByUsername(user.getUsername()))
                .cellars(Collections.emptyList())
                .build();
        return vineyardRepository.save(vineyard);
    }

    public Double getArea(Vineyard vineyard) {
        return vineyardRepository.getAreaMeters(vineyard.getMapArea(), vineyard.getId())/100000;
    }

    public void deleteUserVineyard(Long id, User user) {
        Vineyard vineyard = vineyardRepository.findById(id).orElse(null);
        if (vineyard != null) {
            user.setVineyard(null);
            vineyardRepository.delete(vineyard);
            userRepository.save(user);
        }
    }
}
