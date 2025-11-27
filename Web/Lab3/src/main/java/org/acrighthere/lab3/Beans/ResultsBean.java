package org.acrighthere.lab3.Beans;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Named;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import lombok.Data;
import org.acrighthere.lab3.Model.HitResult;
import org.primefaces.PrimeFaces;

@Data
@Named("resultsBean")
@ApplicationScoped
public class ResultsBean implements Serializable {

  private final List<HitResult> results = new ArrayList<>();

  public void addResult(HitResult result) {
    results.add(result);
  }

  public void reset() {
    results.clear();
    PrimeFaces.current().executeScript("clearGraphPoints();");
  }

  public List<HitResult> getResults() {
    return Collections.unmodifiableList(results);
  }
}
