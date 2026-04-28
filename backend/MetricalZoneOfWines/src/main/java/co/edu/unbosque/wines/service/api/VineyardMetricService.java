package co.edu.unbosque.wines.service.api;

import co.edu.unbosque.wines.entity.VineyardMetric;
import java.util.List;

public interface VineyardMetricService {
    List<VineyardMetric> findAll();
    VineyardMetric findById(Integer id);
    VineyardMetric save(VineyardMetric vineyardMetric);
    void deleteById(Integer id);
    List<VineyardMetric> findByVineyardId(Integer vineyardId);
}