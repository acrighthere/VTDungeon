package org.acrighthere.lab4.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.acrighthere.lab4.backend.dto.PointDto;
import org.acrighthere.lab4.backend.model.User;
import org.acrighthere.lab4.backend.model.Point;
import org.acrighthere.lab4.backend.repository.PointRepository;
import org.acrighthere.lab4.backend.util.PointMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PointService {
    private final PointRepository pointRepository;

    public Point addPoint(double x, double y, int r, User user) {
        if(!isValidX(x) || !isValidY(y) || !isValidR(r)) {
            throw new IllegalArgumentException("Некорректные координаты или радиус");
        }
        long start = System.nanoTime();

        Point point = new Point();
        point.setX(x);
        point.setY(y);
        point.setR(r);
        point.setUser(user);
        point.setCreatedAt(LocalDateTime.now());

        boolean hit = isHit(point);
        point.setHit(hit);

        long end = System.nanoTime();
        double durationMs = (end - start) / 1_000_000.0;
        point.setExecutionTime(durationMs);

        pointRepository.save(point);
        return point;
    }

    public List<Point> getPointsByUser(User user) {
        return pointRepository.findAll().stream()
                .filter(p -> p.getUser().getId() == user.getId())
                .toList();
    }

    public boolean isHit(Point point) {
        double x = point.getX();
        double y = point.getY();
        int r = point.getR();
        if (x >= 0 && y >= 0) return x <= r && y <= r;
        if (x <= 0 && y >= 0) {
            if (x < -r) return false;
            double yMax = 0.5 * (x + r);
            return y <= yMax && y >= 0;
        }
        if (x <= 0 && y <= 0) return (x*x + y*y) <= (r*r);
        return false;
    }


    @Transactional
    public void clearPointsByUser(User user) {
        List<Point> points = pointRepository.findByUserId(user.getId());
        if (!points.isEmpty()) {
            pointRepository.deleteAll(points);
        }
    }


    public Page<PointDto> getPoints(int page, int size) {
        Page<Point> pointsPage = pointRepository.findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        return pointsPage.map(p -> PointMapper.toDto(p, isHit(p)));
    }


    private boolean isValidX(double x) {
        return x >= -3 && x <= 5;
    }

    private boolean isValidY(double y) {
        return y >= -3 && y <= 5;
    }

    private boolean isValidR(int r) {
        return r > 0 && r <= 5;
    }
}
