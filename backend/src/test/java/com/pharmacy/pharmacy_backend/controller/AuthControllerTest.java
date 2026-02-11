package com.pharmacy.pharmacy_backend.controller;

import com.pharmacy.pharmacy_backend.model.User;
import com.pharmacy.pharmacy_backend.payload.request.LoginRequest;
import com.pharmacy.pharmacy_backend.payload.response.JwtResponse;
import com.pharmacy.pharmacy_backend.payload.response.MessageResponse;
import com.pharmacy.pharmacy_backend.repository.UserRepository;
import com.pharmacy.pharmacy_backend.security.JwtTokenProvider;
import com.pharmacy.pharmacy_backend.security.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder encoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthController authController;

    private LoginRequest loginRequest;
    private User signUpRequest;
    private Authentication authentication;
    private UserDetailsImpl userDetails;

    @BeforeEach
    void setUp() {
        loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("testpass");

        signUpRequest = new User();
        signUpRequest.setUsername("newuser");
        signUpRequest.setEmail("newuser@example.com");
        signUpRequest.setPassword("newpass");
        signUpRequest.setRole("USER");

        userDetails = new UserDetailsImpl(1L, "testuser", "testpass", "test@example.com", 
                                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
        authentication = mock(Authentication.class);
        lenient().when(authentication.getPrincipal()).thenReturn(userDetails);
    }

    @Test
    void authenticateUser_Success_ReturnsJwtResponse() {
        // Arrange
        String jwtToken = "mock-jwt-token";
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(jwtTokenProvider.generateToken(authentication)).thenReturn(jwtToken);

        // Act
        ResponseEntity<?> response = authController.authenticateUser(loginRequest);

        // Assert
        assertTrue(response.getStatusCode().is2xxSuccessful());
        JwtResponse jwtResponse = (JwtResponse) response.getBody();
        assertNotNull(jwtResponse);
        assertEquals(jwtToken, jwtResponse.getToken());
        assertEquals("testuser", jwtResponse.getUsername());
        assertEquals("Bearer", jwtResponse.getType());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtTokenProvider).generateToken(authentication);
    }

    @Test
    void authenticateUser_AuthenticationFails_ThrowsException() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("Bad credentials"));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            authController.authenticateUser(loginRequest);
        });
    }

    @Test
    void registerUser_UsernameExists_ReturnsBadRequest() {
        // Arrange
        when(userRepository.existsByUsername("newuser")).thenReturn(true);

        // Act
        ResponseEntity<?> response = authController.registerUser(signUpRequest);

        // Assert
        assertEquals(400, response.getStatusCodeValue());
        MessageResponse message = (MessageResponse) response.getBody();
        assertEquals("Error: Username is already taken!", message.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void registerUser_Success_ReturnsSuccessMessage() {
        // Arrange
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(signUpRequest);

        // Act
        ResponseEntity<?> response = authController.registerUser(signUpRequest);

        // Assert
        assertTrue(response.getStatusCode().is2xxSuccessful());
        MessageResponse message = (MessageResponse) response.getBody();
        assertEquals("User registered successfully!", message.getMessage());
        verify(encoder).encode("newpass");
        verify(userRepository).save(argThat(user -> 
            user.getUsername().equals("newuser") && 
            user.getRole().equals("USER")));
    }

    @Test
    void registerUser_NullRole_DefaultsToUSER() {
        // Arrange
        signUpRequest.setRole(null);
        when(userRepository.existsByUsername("newuser")).thenReturn(false);

        // Act
        ResponseEntity<?> response = authController.registerUser(signUpRequest);

        // Assert
        assertTrue(response.getStatusCode().is2xxSuccessful());
        verify(userRepository).save(argThat(user -> user.getRole().equals("USER")));
    }

    @Test
    void registerUser_ValidatesPasswordEncoding() {
        // Arrange
        String encodedPassword = "$2a$10$...encoded...";
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(encoder.encode("newpass")).thenReturn(encodedPassword);

        // Act
        authController.registerUser(signUpRequest);

        // Assert
        verify(encoder).encode("newpass");
        verify(userRepository).save(argThat(user -> 
            encodedPassword.equals(user.getPassword())));
    }
}
