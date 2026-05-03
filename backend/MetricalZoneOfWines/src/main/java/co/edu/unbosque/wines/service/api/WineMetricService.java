package co.edu.unbosque.wines.service.api;

import co.edu.unbosque.wines.dto.WineMetricDTO;
import java.util.List;

public interface WineMetricService {
    List<WineMetricDTO> findAll();
    WineMetricDTO findById(Integer id);
    WineMetricDTO save(WineMetricDTO wineMetricDTO);
    void deleteById(Integer id);
    List<WineMetricDTO> findByWineId(Integer wineId);
}