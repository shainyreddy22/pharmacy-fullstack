package com.pharmacy.pharmacy_backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${app.jwtSecret}")
    private String jwtSecret;

    @Value("${app.jwtExpirationInMs}")
    private int jwtExpirationInMs;

    private Key getSigningKey() {
        // Use the recommended approach to generate a secure key for HS512
        // First, let's check if the configured secret is a valid Base64 encoded key of sufficient length
        byte[] keyBytes;
        try {
            byte[] decodedBytes = Base64.getDecoder().decode(jwtSecret);
            if (decodedBytes.length >= 64) { // At least 512 bits for HS512
                return Keys.hmacShaKeyFor(decodedBytes);
            }
        } catch (IllegalArgumentException e) {
            // If not valid Base64, we'll process it as a regular string
        }
        
        // If the configured secret isn't properly sized, generate a key from it
        // but ensure it meets the minimum requirements
        keyBytes = jwtSecret.getBytes();
        
        // If the secret is too short, we can hash it to create a proper-length key
        if (keyBytes.length < 64) {
            // Use SHA-256 to hash the secret and expand it to appropriate length
            // Then take the first 64 bytes to ensure 512-bit key for HS512
            MessageDigest sha256;
            try {
                sha256 = MessageDigest.getInstance("SHA-256");
                byte[] hashedBytes = sha256.digest(keyBytes);
                
                // Create a 64-byte array (512 bits) by repeating or expanding the hash
                byte[] expandedKey = new byte[64];
                for (int i = 0; i < 64; i++) {
                    expandedKey[i] = hashedBytes[i % hashedBytes.length];
                }
                return Keys.hmacShaKeyFor(expandedKey);
            } catch (NoSuchAlgorithmException ex) {
                // If SHA-256 isn't available, fall back to the recommended method
                return Keys.secretKeyFor(SignatureAlgorithm.HS512);
            }
        }
        
        // If the key is already long enough, use it directly
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUsernameFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}