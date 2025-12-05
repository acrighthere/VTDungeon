package org.acrighthere.lab3.Beans;

import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
  private List<Number> selectedR = new ArrayList<>();

  private Double graphX;
  private Double graphY;

  private String errorMessage;
  private LocalDateTime localTime = LocalDateTime.now();

  @Inject private HitResultDAO hitResultDAO;
  @Inject private ResultsBean resultsBean;

  public void checkPoint() {
    if (x == null || y == null || selectedR.isEmpty()) {
      errorMessage = "Заполните все поля.";
      return;
    }

    processPoints(x, y);
    errorMessage = null;
  }

  public void checkPointFromGraph() {
    if (graphX == null || graphY == null || selectedR.isEmpty()) {
      return;
    }

    processPoints(graphX, graphY);

    graphX = null;
    graphY = null;
  }

  // === Общий метод — вся логика здесь! ===
  private void processPoints(double x, double y) {
    for (Number rNum : selectedR) {
      double r = rNum.doubleValue();

      Point point = new Point(x, y, r);

      long start = System.nanoTime();
      boolean hit = AreaChecker.checkHit(point);
      long execTime = System.nanoTime() - start;

      double execTimeMs = Math.round((execTime / 1_000_000.0) * 100.0) / 100.0;

      HitResult result = new HitResult();
      result.setPoint(point);
      result.setHit(hit);
      result.setAtTime(LocalDateTime.now());
      result.setExecTime(execTimeMs);

      hitResultDAO.save(result);
      resultsBean.addResult(result);
    }
  }

  public String getFormattedLocalTime() {
    return LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
  }
}
