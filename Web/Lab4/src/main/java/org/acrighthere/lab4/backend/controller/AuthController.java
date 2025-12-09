package org.acrighthere.lab4.backend.controller;

import org.acrighthere.lab4.backend.model.User;
import org.acrighthere.lab4.backend.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> body) {
        User user = authService.register(body.get("username"), body.get("password"));
        return ResponseEntity.ok(Map.of("id",user.getId()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        boolean valid = authService.login(body.get("username"), body.get("password"));
        if (valid) return ResponseEntity.ok(Map.of("status","ok"));
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("status", "error"));
    }
}
