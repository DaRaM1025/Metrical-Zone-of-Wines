package co.edu.unbosque.wines.repository;

import co.edu.unbosque.wines.entity.RegionMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RegionMetricRepository extends JpaRepository<RegionMetric, Integer> {
    List<RegionMetric> findByRegionId(Integer regionId);
}