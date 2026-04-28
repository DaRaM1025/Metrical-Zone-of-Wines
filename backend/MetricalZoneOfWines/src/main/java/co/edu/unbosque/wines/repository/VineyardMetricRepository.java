package co.edu.unbosque.wines.repository;

import co.edu.unbosque.wines.entity.VineyardMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VineyardMetricRepository extends JpaRepository<VineyardMetric, Integer> {
    List<VineyardMetric> findByVineyardId(Integer vineyardId);
}