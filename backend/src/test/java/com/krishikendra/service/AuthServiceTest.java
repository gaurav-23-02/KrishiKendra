package com.krishikendra.service;

import com.krishikendra.dto.request.LoginRequest;
import com.krishikendra.dto.request.RegisterRequest;
import com.krishikendra.dto.response.AuthResponse;
import com.krishikendra.entity.Role;
import com.krishikendra.entity.User;
import com.krishikendra.exception.BadRequestException;
import com.krishikendra.repository.UserRepository;
import com.krishikendra.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User(
                "Suresh Sharma",
                "suresh@example.com",
                "encodedPassword123",
                "9876543210",
                "Madhya Pradesh",
                "Indore",
                "en",
                Role.FARMER
        );
        sampleUser.setId(1L);
    }

    @Test
    void register_Success() {
        RegisterRequest req = new RegisterRequest(
                "Suresh Sharma",
                "suresh@example.com",
                "password123",
                "9876543210",
                "Madhya Pradesh",
                "Indore",
                "en"
        );

        when(userRepository.existsByEmail("suresh@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword123");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(jwtService.generateToken("suresh@example.com", "FARMER")).thenReturn("mock-jwt-token");

        AuthResponse response = authService.register(req);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("suresh@example.com", response.getUser().getEmail());
        assertEquals("FARMER", response.getUser().getRole());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_DuplicateEmail_ThrowsBadRequest() {
        RegisterRequest req = new RegisterRequest(
                "Suresh Sharma",
                "suresh@example.com",
                "password123",
                "9876543210",
                "Madhya Pradesh",
                "Indore",
                "en"
        );

        when(userRepository.existsByEmail("suresh@example.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(req));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        LoginRequest req = new LoginRequest("suresh@example.com", "password123");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(null);
        when(userRepository.findByEmail("suresh@example.com")).thenReturn(Optional.of(sampleUser));
        when(jwtService.generateToken("suresh@example.com", "FARMER")).thenReturn("mock-jwt-token");

        AuthResponse response = authService.login(req);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("suresh@example.com", response.getUser().getEmail());
    }
}
