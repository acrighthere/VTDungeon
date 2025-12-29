package org.acrighthere.lab4.backend.util;

import org.acrighthere.lab4.backend.dto.PointDto;
import org.acrighthere.lab4.backend.model.Point;

import java.time.format.DateTimeFormatter;

public class PointMapper {

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");

    public static PointDto toDto(Point point, boolean hit) {
        PointDto dto = new PointDto();
        dto.setId(point.getId());
        dto.setX(point.getX());
        dto.setY(point.getY());
        dto.setR(point.getR());
        dto.setHit(hit);
        dto.setExecutionTime(Math.round(point.getExecutionTime() * 100.0) / 100.0);
        dto.setCreatedAt(point.getCreatedAt().format(FORMATTER));
        if (point.getUser() != null) {
            dto.setOwner(point.getUser().getUsername());
        }

        return dto;
    }

}

