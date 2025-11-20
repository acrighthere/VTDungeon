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
import org.primefaces.PrimeFaces;

@Data
@Named("areaBean")
@SessionScoped
public class AreaBean implements Serializable {

  private Double x;
  private Double y;
  private List<Number> selectedR = new ArrayList<>();

  private String errorMessage;
  private LocalDateTime localTime = LocalDateTime.now();

  @Inject private HitResultDAO hitResultDAO;
  @Inject private ResultsBean resultsBean;

  public void checkPoint() {
    try {
      if (x == null || y == null || selectedR.isEmpty()) {
        errorMessage = "Заполните все поля.";
        return;
      }

      for (Number rNum : selectedR) {
        double r = rNum.doubleValue();
        Point point = new Point(x, y, r);
        long start = System.nanoTime();
        boolean hit = AreaChecker.checkHit(point);
        long execTime = (System.nanoTime() - start) / 1_000_000;

        HitResult result = new HitResult();
        result.setPoint(point);
        result.setHit(hit);
        result.setAtTime(LocalDateTime.now());
        result.setExecTime(execTime);
        hitResultDAO.save(result);
        resultsBean.addResult(result);

        PrimeFaces.current()
            .executeScript("addPointFromServer(" + x + "," + y + "," + r + "," + hit + ");");
      }

      errorMessage = null;

    } catch (Exception e) {
      e.printStackTrace();
      errorMessage = "Ошибка: " + e.getMessage();
    }
  }

  public String getFormattedLocalTime() {
    return localTime.format(DateTimeFormatter.ofPattern("HH:mm:ss"));
  }
}
