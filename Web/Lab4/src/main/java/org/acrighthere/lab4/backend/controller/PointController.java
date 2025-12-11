package org.acrighthere.lab4.backend.controller;

import lombok.RequiredArgsConstructor;
import org.acrighthere.lab4.backend.model.Point;
import org.acrighthere.lab4.backend.model.User;
import org.acrighthere.lab4.backend.service.PointService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/points")
public class PointController {
    private final PointService pointService;


    @PostMapping("/add")
    public ResponseEntity<?> addPoint(
            @RequestParam double x,
            @RequestParam double y,
            @RequestParam int r,
            @AuthenticationPrincipal User user
            ){
        Point point = pointService.addPoint(x,y,r,user);
        return ResponseEntity.ok(point);
    }

    @GetMapping
    public ResponseEntity<List<Point>> getUserPoints(@AuthenticationPrincipal User user) {
        List<Point> points = pointService.getPointsByUser(user);
        return ResponseEntity.ok(points);
    }

}
