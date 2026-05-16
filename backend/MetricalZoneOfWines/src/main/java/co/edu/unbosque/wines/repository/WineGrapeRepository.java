package co.edu.unbosque.wines.repository;

import co.edu.unbosque.wines.entity.WineGrape;
import co.edu.unbosque.wines.entity.WineGrapeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WineGrapeRepository extends JpaRepository<WineGrape, WineGrapeId> {
    List<WineGrape> findByWineId(Integer wineId);
    List<WineGrape> findByGrapeId(Integer grapeId);
}