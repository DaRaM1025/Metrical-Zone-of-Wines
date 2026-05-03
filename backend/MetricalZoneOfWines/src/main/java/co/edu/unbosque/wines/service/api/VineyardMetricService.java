package co.edu.unbosque.wines.service.api;

import co.edu.unbosque.wines.dto.VineyardMetricDTO;
import java.util.List;

public interface VineyardMetricService {
    List<VineyardMetricDTO> findAll();
    VineyardMetricDTO findById(Integer id);
    VineyardMetricDTO save(VineyardMetricDTO vineyardMetricDTO);
    void deleteById(Integer id);
    List<VineyardMetricDTO> findByVineyardId(Integer vineyardId);
}