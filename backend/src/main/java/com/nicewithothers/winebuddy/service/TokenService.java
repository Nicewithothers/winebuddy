package com.nicewithothers.winebuddy.service;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.nicewithothers.winebuddy.model.User;
import com.nicewithothers.winebuddy.utility.JwtUtility;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class TokenService {
    private final JwtUtility jwtUtility;

    private final Cache<Long, String> userTokenCache = Caffeine.newBuilder()
            .expireAfterWrite(Duration.ofHours(23))
            .maximumSize(1000)
            .build();

    private final Cache<Long, Long> userTokenExpiryCache = Caffeine.newBuilder()
            .expireAfterWrite(Duration.ofHours(24))
            .maximumSize(1000)
            .build();

    public String getOrGenerateNewToken(User user) {
        String cachedToken = userTokenCache.getIfPresent(user.getId());

        if (cachedToken != null) {
            if (!jwtUtility.isTokenExpired(cachedToken)) {
                return cachedToken;
            }
            invalidateToken(user);
        }

        String newToken = jwtUtility.generateToken(user);
        userTokenCache.put(user.getId(), newToken);
        userTokenExpiryCache.put(user.getId(), System.currentTimeMillis() + Duration.ofHours(24).toMillis());

        return newToken;
    }

    public void invalidateToken(User user) {
        userTokenCache.invalidate(user.getId());
        userTokenExpiryCache.invalidate(user.getId());
    }
}
