package org.acrighthere.lab4.backend.controller;

import lombok.RequiredArgsConstructor;
import org.acrighthere.lab4.backend.dto.PointDto;
import org.acrighthere.lab4.backend.exception.UnauthorizedException;
import org.acrighthere.lab4.backend.model.Point;
import org.acrighthere.lab4.backend.model.User;
import org.acrighthere.lab4.backend.service.PointService;
import org.acrighthere.lab4.backend.util.PointMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/points")
public class PointController {

    private final PointService pointService;

    @PostMapping("/add")
    public ResponseEntity<PointDto> addPoint(
            @RequestParam double x,
            @RequestParam double y,
            @RequestParam int r,
            @AuthenticationPrincipal User user
    ) {
        if (user == null) {
            throw new UnauthorizedException();
        }

        Point point = pointService.addPoint(x, y, r, user);
        boolean hit = pointService.isHit(point);
        return ResponseEntity.ok(PointMapper.toDto(point, hit));
    }

    @GetMapping
    public Page<PointDto> getPoints(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return pointService.getPoints(page, size);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearPoints(@AuthenticationPrincipal User user) {
        if (user == null) {
            throw new UnauthorizedException();
        }
        pointService.clearPointsByUser(user);
        return ResponseEntity.ok().build();
    }
}
