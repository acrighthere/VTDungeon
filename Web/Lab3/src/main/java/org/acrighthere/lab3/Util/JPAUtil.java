package org.acrighthere.lab3.Util;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

public class JPAUtil {

  private static final String PERSISTENCE_UNIT_NAME = "Lab3PU";
  private static EntityManagerFactory emf;

  static {
    try {
      emf = Persistence.createEntityManagerFactory(PERSISTENCE_UNIT_NAME);
    } catch (Exception e) {
      e.printStackTrace();
      throw new ExceptionInInitializerError("Ошибка при создании EntityManagerFactory");
    }
  }

  public static EntityManager getEntityManager() {
    return emf.createEntityManager();
  }

  public static void closeEntityManagerFactory() {
    if (emf != null) {
      emf.close();
    }
  }
}
