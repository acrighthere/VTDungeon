package org.acrighthere.lab3.DAO;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Named;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.acrighthere.lab3.Model.HitResult;

@Named
@ApplicationScoped
public class HitResultDAO {

  @PersistenceContext(unitName = "Lab3PU")
  private EntityManager em;

  @Transactional
  public void save(HitResult hitResult) {
    em.persist(hitResult);
  }
}
