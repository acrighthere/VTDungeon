package org.acrighthere.lab3.DAO;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Named;
import jakarta.persistence.EntityManager;
import org.acrighthere.lab3.Model.HitResult;
import org.acrighthere.lab3.Util.JPAUtil;

@Named
@ApplicationScoped
public class HitResultDAO {
  public void save(HitResult hitResult) {
    EntityManager entityManager = JPAUtil.getEntityManager();
    try {
      entityManager.getTransaction().begin();
      entityManager.persist(hitResult);
      entityManager.getTransaction().commit();
    } catch (Exception e) {
      entityManager.getTransaction().rollback();
    } finally {
      entityManager.close();
    }
  }
}
