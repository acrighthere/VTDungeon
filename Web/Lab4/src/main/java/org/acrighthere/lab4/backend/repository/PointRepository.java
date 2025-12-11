package org.acrighthere.lab4.backend.repository;

import org.acrighthere.lab4.backend.model.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PointRepository extends JpaRepository<Point, Integer> {
    Optional<Point> findById(long id);
    Optional<Point> findByUserId(long id);
}
