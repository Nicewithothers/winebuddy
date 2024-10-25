package com.nicewithothers.winebuddy.repository;

import com.nicewithothers.winebuddy.models.AuthResponse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRepository extends JpaRepository<AuthResponse, Long> {
    AuthResponse findAuthResponseByTokenContains(String token);
    AuthResponse findAuthResponseByToken(String token);
    boolean existsAuthResponseByToken(String token);
}
