package org.acrighthere.lab3.Beans;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Named;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Named("clockBean")
@RequestScoped
public class ClockBean {
  public String getCurrentTime() {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
    return LocalDateTime.now().format(formatter);
  }
}
