package co.edu.unbosque.wines.service.api;

import co.edu.unbosque.wines.dto.RegionMetricDTO;
import java.util.List;

public interface RegionMetricService {
    List<RegionMetricDTO> findAll();
    RegionMetricDTO findById(Integer id);
    RegionMetricDTO save(RegionMetricDTO regionMetricDTO);
    void deleteById(Integer id);
    List<RegionMetricDTO> findByRegionId(Integer regionId);
}