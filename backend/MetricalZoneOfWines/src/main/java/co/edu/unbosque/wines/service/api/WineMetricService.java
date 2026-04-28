package co.edu.unbosque.wines.service.api;

import co.edu.unbosque.wines.entity.WineMetric;
import java.util.List;

public interface WineMetricService {
    List<WineMetric> findAll();
    WineMetric findById(Integer id);
    WineMetric save(WineMetric wineMetric);
    void deleteById(Integer id);
    List<WineMetric> findByWineId(Integer wineId);
}