package org.acrighthere.lab4.backend.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.acrighthere.lab4.backend.model.User;
import org.acrighthere.lab4.backend.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping(value = "/register", consumes = "application/json")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> body) {
        User user = authService.register(body.get("username"), body.get("password"));
        return ResponseEntity.ok(Map.of("id",user.getId()));
    }

    @PostMapping(value = "/login", consumes = "application/json")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body,
                                   HttpServletResponse response) {

        String username = body.get("username");
        String password = body.get("password");

        try {
            String accessToken = authService.login(username, password);
            String refreshToken = authService.createRefresh(username);

            Cookie cookie = new Cookie("refresh_token", refreshToken);
            cookie.setHttpOnly(true);
            cookie.setPath("/api/auth/refresh");
            cookie.setMaxAge(60 * 60 * 24 * 30);

            response.addCookie(cookie);

            return ResponseEntity.ok(Map.of("accessToken", accessToken));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }
    }


    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue(value = "refresh_token", required = false) String refreshToken) {

        if (refreshToken == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No refresh token"));

        try {
            String newAccess = authService.refreshAccess(refreshToken);
            return ResponseEntity.ok(Map.of("accessToken", newAccess));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid refresh token"));
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verify(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Missing token"));
        }
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getName() != null && !auth.getName().equals("anonymousUser")) {
            return ResponseEntity.ok(Map.of("valid", true, "username", auth.getName()));
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid token"));
    }
}
