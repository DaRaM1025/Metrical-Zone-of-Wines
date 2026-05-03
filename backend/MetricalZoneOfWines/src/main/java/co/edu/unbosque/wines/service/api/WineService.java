package co.edu.unbosque.wines.service.api;

import co.edu.unbosque.wines.dto.WineDTO;
import java.util.List;

public interface WineService {
    List<WineDTO> findAll();
    WineDTO findById(Integer id);
    WineDTO save(WineDTO wineDTO);
    void deleteById(Integer id);
    List<WineDTO> findByVineyardId(Integer vineyardId);
}