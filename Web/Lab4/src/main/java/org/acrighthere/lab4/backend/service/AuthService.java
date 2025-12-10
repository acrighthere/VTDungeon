package org.acrighthere.lab4.backend.service;

import org.acrighthere.lab4.backend.model.User;
import org.acrighthere.lab4.backend.repository.UserRepository;
import org.acrighthere.lab4.backend.security.jwt.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = new JwtService();
    }

    public User register(String username, String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Пользователь уже существует");
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        return userRepository.save(user);
    }

    public String login(String username, String password) {
        return userRepository.findByUsername(username)
                .filter(u -> passwordEncoder.matches(password, u.getPassword()))
                .map(u -> jwtService.generateAccessToken(username))
                .orElseThrow(() -> new RuntimeException("Неверные данные"));
    }

    public String createRefresh(String username){
        return jwtService.generateRefreshToken(username);
    }

    public String refreshAccess(String refreshToken){
        String username = jwtService.extractUsername(refreshToken);
        return jwtService.generateRefreshToken(username);
    }
}
