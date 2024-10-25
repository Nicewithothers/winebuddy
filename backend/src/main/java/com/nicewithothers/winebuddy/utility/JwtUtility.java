package com.nicewithothers.winebuddy.utility;

import com.nicewithothers.winebuddy.models.AuthResponse;
import com.nicewithothers.winebuddy.repository.TokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JwtUtility {
    private CacheManager cacheManager;
    private TokenRepository tokenRepository;

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    private SecretKey generateSecretKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    private String createToken(UserDetails userDetails) {
        SecretKey key = generateSecretKey();
        String token = Jwts.builder()
                .issuedAt(new Date(System.currentTimeMillis()))
                .signWith(key)
                .compact();
        AuthResponse authResponse = new AuthResponse(token, userDetails.getAuthorities().toString());
        tokenRepository.save(authResponse);
        return token;
    }

    public String generateToken(UserDetails userDetails) {
        return createToken(userDetails);
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(generateSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        return claimsResolver.apply(extractAllClaims(token));
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiraton(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public List<GrantedAuthority> extractRoles(String token) {
        Claims claims = extractAllClaims(token);
        List<?> rawRoles = claims.get("auth", List.class);
        return rawRoles.stream()
                .filter(role -> role instanceof GrantedAuthority)
                .map(role -> (GrantedAuthority) role)
                .collect(Collectors.toList());
    }

    public boolean isAuthExists(String token, UserDetails userDetails) {
        AuthResponse authResponse = tokenRepository.findAuthResponseByToken(token);
        return userDetails.getAuthorities().toString().contains(authResponse.getRole().substring(1, authResponse.getRole().length() - 1));
    }

    @Cacheable(value = "tokenCache", key = "#token")
    public boolean validateToken(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && tokenRepository.existsAuthResponseByToken(token) && isAuthExists(token, userDetails));
    }

    public void invalidateToken(String token) {
        tokenRepository.delete(tokenRepository.findAuthResponseByTokenContains(token.substring(7)));
        cacheManager.getCache("tokenCache").clear();
    }
}
