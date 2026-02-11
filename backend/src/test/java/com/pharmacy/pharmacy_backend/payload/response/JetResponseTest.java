package com.pharmacy.pharmacy_backend.payload.response;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class JwtResponseTest {
    
    @Test
    void constructor_SetsAllFields() {
        JwtResponse response = new JwtResponse(
            "token", 1L, "user", "user@example.com", "ROLE_USER"
        );
        
        assertEquals("token", response.getToken());
        assertEquals(1L, response.getId());
        assertEquals("user", response.getUsername());
        assertEquals("user@example.com", response.getEmail());
        assertEquals("Bearer", response.getType());
    }
}
