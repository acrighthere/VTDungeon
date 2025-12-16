package org.acrighthere.lab4.backend.service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    private final Bandwidth authRegisterLimit = Bandwidth.classic(
            3, Refill.greedy(3, Duration.ofHours(1))
    );

    private final Bandwidth authLoginLimit = Bandwidth.classic(
            5, Refill.greedy(5, Duration.ofMinutes(10))
    );

    private final Bandwidth defaultLimit = Bandwidth.classic(
            100, Refill.greedy(100, Duration.ofMinutes(1))
    );

    private enum Category {
        AUTH_REGISTER,
        AUTH_LOGIN,
        DEFAULT
    }


    public Bucket resolveBucket(String ip, String requestPath) {
        Category category = detectCategory(requestPath);
        String key = ip + ":" + category.name();

        return buckets.computeIfAbsent(key, k -> Bucket.builder()
                .addLimit(bandwidthFor(category))
                .build());
    }


    public long getRetryAfterSeconds(String ip, String requestPath) {
        Category category = detectCategory(requestPath);
        Duration refill = refillDurationFor(category);
        return refill != null ? refill.getSeconds() : 60L;
    }

    private Category detectCategory(String requestPath) {
        if (requestPath.equals("/api/auth/register") || requestPath.startsWith("/api/auth/register/")) {
            return Category.AUTH_REGISTER;
        }
        if (requestPath.equals("/api/auth/login") || requestPath.startsWith("/api/auth/login/")) {
            return Category.AUTH_LOGIN;
        }
        return Category.DEFAULT;
    }

    private Bandwidth bandwidthFor(Category category) {
        return switch (category) {
            case AUTH_REGISTER -> authRegisterLimit;
            case AUTH_LOGIN -> authLoginLimit;
            case DEFAULT -> defaultLimit;
        };
    }

    private Duration refillDurationFor(Category category) {
        return switch (category) {
            case AUTH_REGISTER -> Duration.ofHours(1);
            case AUTH_LOGIN -> Duration.ofMinutes(10);
            case DEFAULT -> Duration.ofMinutes(1);
        };
    }
}
