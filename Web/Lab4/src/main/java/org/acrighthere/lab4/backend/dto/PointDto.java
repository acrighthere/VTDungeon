package org.acrighthere.lab4.backend.dto;

import lombok.Data;

@Data
public class PointDto {
    private long id;
    private double x;
    private double y;
    private int r;
    private boolean hit;
    private double executionTime;
    private String createdAt;
    private String owner;
}
