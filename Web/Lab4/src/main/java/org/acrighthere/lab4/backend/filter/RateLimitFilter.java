package org.acrighthere.lab4.backend.filter;

import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.acrighthere.lab4.backend.service.RateLimitService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimitService rateLimitService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws IOException, ServletException {

        String ip = getClientIp(request);
        String path = request.getRequestURI();

        Bucket bucket = rateLimitService.resolveBucket(ip, path);

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
            return;
        }

        long retryAfterSeconds = rateLimitService.getRetryAfterSeconds(ip, path);

        response.setHeader("Retry-After", String.valueOf(retryAfterSeconds));
        response.setStatus(429);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        response.getWriter().write("""
            {
              "error": "Too Many Requests",
              "message": "Слишком много запросов. Попробуйте позже.",
              "retryAfter": %d
            }
            """.formatted(retryAfterSeconds));
    }

    private String getClientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) return xff.split(",")[0].trim();
        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) return realIp;
        return request.getRemoteAddr();
    }
}
