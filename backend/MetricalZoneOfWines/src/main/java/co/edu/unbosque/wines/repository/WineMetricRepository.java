package co.edu.unbosque.wines.repository;

import co.edu.unbosque.wines.entity.WineMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WineMetricRepository extends JpaRepository<WineMetric, Integer> {
    List<WineMetric> findByWineId(Integer wineId);
}