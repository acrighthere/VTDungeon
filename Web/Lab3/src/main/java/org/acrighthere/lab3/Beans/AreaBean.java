package org.acrighthere.lab3.Beans;

import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;
import org.acrighthere.lab3.DAO.HitResultDAO;
import org.acrighthere.lab3.Model.HitResult;
import org.acrighthere.lab3.Model.Point;
import org.acrighthere.lab3.Util.AreaChecker;

@Data
@Named("areaBean")
@SessionScoped
public class AreaBean implements Serializable {

  private Double x;
  private Double y;
  private List<Double> selectedR = new ArrayList<>();

  private String errorMessage;
  private LocalDateTime localTime = LocalDateTime.now();

  @Inject private HitResultDAO hitResultDAO;

  private final List<HitResult> results = new ArrayList<>();

  public void checkPoint() {
    try {
      if (x == null || y == null || selectedR.isEmpty()) {
        errorMessage = "Заполните все поля.";
        return;
      }

      for (Double r : selectedR) {
        Point point = new Point(x, y, r);
        boolean hit = AreaChecker.checkHit(point);

        HitResult result = new HitResult();
        result.setPoint(point);
        result.setHit(hit);
        result.setAtTime(LocalDateTime.now());

        hitResultDAO.save(result);
        results.add(result);
      }

      errorMessage = null;

    } catch (Exception e) {
      e.printStackTrace();
      errorMessage = "Ошибка: " + e.getMessage();
    }
  }
}
