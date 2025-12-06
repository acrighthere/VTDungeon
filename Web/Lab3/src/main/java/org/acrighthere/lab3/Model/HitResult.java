package org.acrighthere.lab3.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import lombok.Data;

@Entity
@Data
public class HitResult {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Embedded private Point point;
  private boolean hit;
  private LocalDateTime atTime;
  @Transient private double execTime;

  public String getFormattedServerTime() {
    return atTime != null ? atTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : "";
  }
}
