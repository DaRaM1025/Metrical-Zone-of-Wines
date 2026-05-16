package co.edu.unbosque.wines.service.api;

import co.edu.unbosque.wines.dto.VineyardDTO;
import java.util.List;

public interface VineyardService {
    List<VineyardDTO> findAll();
    VineyardDTO findById(Integer id);
    VineyardDTO save(VineyardDTO vineyardDTO);
    void deleteById(Integer id);
    List<VineyardDTO> findByRegionId(Integer regionId);
}