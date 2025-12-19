package org.acrighthere.lab4.backend.repository;

import jakarta.transaction.Transactional;
import org.acrighthere.lab4.backend.model.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PointRepository extends JpaRepository<Point, Integer> {
    Optional<Point> findById(long id);
    List<Point> findByUserId(long id);
    void deleteByUserId(long userId);

}
