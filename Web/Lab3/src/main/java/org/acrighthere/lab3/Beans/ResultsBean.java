package org.acrighthere.lab3.Beans;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Named;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;
import org.acrighthere.lab3.Model.HitResult;

@Data
@Named("resultsBean")
@ApplicationScoped
public class ResultsBean implements Serializable {

  private final List<HitResult> results = new ArrayList<>();
  private String resultsJson = "[]";

  public void addResult(HitResult result) {
    results.add(0, result); // ← можно в конец
    updateJson();
  }

  public void reset() {
    results.clear();
    resultsJson = "[]";
  }

  // ← ГЛАВНОЕ: возвращаем отсортированный список!
  public List<HitResult> getResults() {
    return results.stream()
        .sorted((a, b) -> Long.compare(b.getId(), a.getId())) // новые сверху
        .toList();
  }

  public String getResultsJson() {
    return resultsJson;
  }

  private void updateJson() {
    if (results.isEmpty()) {
      resultsJson = "[]";
      return;
    }

    StringBuilder sb = new StringBuilder("[");
    // сортируем перед JSON тоже — на всякий случай
    results.stream()
        .sorted((a, b) -> Long.compare(b.getId(), a.getId()))
        .forEach(
            res ->
                sb.append(
                    String.format(
                        "{\"x\":%.4f,\"y\":%.4f,\"r\":%.1f,\"hit\":%s},",
                        res.getPoint().getX(),
                        res.getPoint().getY(),
                        res.getPoint().getR(),
                        res.isHit())));
    sb.setCharAt(sb.length() - 1, ']');
    resultsJson = sb.toString();
  }
}
