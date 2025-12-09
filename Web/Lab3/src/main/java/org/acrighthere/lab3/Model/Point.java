package org.acrighthere.lab3.Model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Embeddable
@NoArgsConstructor
public class Point {
  @Min(-5)
  @Max(5)
  double x;

  @Min(-3)
  @Max(5)
  double y;

  double r;
}
