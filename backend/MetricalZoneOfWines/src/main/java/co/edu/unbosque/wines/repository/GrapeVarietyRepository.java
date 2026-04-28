package co.edu.unbosque.wines.repository;

import co.edu.unbosque.wines.entity.GrapeVariety;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GrapeVarietyRepository extends JpaRepository<GrapeVariety, Integer> {
}