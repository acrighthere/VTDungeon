package org.acrighthere.lab3.Beans;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Named;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Named("clockBean")
@RequestScoped
public class ClockBean implements Serializable {
  public String getCurrentTime() {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
    return LocalDateTime.now().format(formatter);
  }
}
