package co.edu.unbosque.wines.service.api;

import co.edu.unbosque.wines.entity.RegionMetric;
import java.util.List;

public interface RegionMetricService {
    List<RegionMetric> findAll();
    RegionMetric findById(Integer id);
    RegionMetric save(RegionMetric regionMetric);
    void deleteById(Integer id);
    List<RegionMetric> findByRegionId(Integer regionId);
}