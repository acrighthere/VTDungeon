package org.acrighthere.lab4.backend.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.acrighthere.lab4.backend.dto.*;
import org.acrighthere.lab4.backend.model.User;
import org.acrighthere.lab4.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping(value = "/register", consumes = "application/json")
    public ResponseEntity<UserIdResponse> registerUser(@RequestBody UserRegisterRequest request) {
        User user = authService.register(request.username(), request.password());
        return ResponseEntity.ok(new UserIdResponse(user.getId()));
    }

    @PostMapping(value = "/login", consumes = "application/json")
    public ResponseEntity<AuthResponse> login(@RequestBody UserLoginRequest request,
                                              HttpServletResponse response) {

        String access = authService.login(request.username(), request.password());
        String refresh = authService.createRefresh(request.username());

        Cookie cookie = new Cookie("refresh_token", refresh);
        cookie.setHttpOnly(true);
        cookie.setPath("/api/auth/refresh");
        cookie.setMaxAge(60 * 60 * 24 * 30);
        response.addCookie(cookie);

        return ResponseEntity.ok(new AuthResponse(access));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@CookieValue(value = "refresh_token", required = false) String refreshToken) {

        if (refreshToken == null) {
            throw new RuntimeException("No refresh token");
        }

        String newAccess = authService.refreshAccess(refreshToken);
        return ResponseEntity.ok(new AuthResponse(newAccess));
    }

    @GetMapping("/verify")
    public ResponseEntity<TokenVerifyResponse> verify(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing token");
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null
                && auth.isAuthenticated()
                && auth.getName() != null
                && !auth.getName().equals("anonymousUser")) {

            return ResponseEntity.ok(new TokenVerifyResponse(true, auth.getName()));
        }

        throw new RuntimeException("Invalid token");
    }
}
