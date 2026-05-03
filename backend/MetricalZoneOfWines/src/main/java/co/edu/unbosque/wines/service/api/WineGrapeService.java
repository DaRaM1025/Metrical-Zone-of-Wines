package co.edu.unbosque.wines.service.api;

import co.edu.unbosque.wines.dto.WineGrapeDTO;
import co.edu.unbosque.wines.entity.WineGrapeId;
import java.util.List;

public interface WineGrapeService {
    List<WineGrapeDTO> findAll();
    WineGrapeDTO findById(WineGrapeId id);
    WineGrapeDTO save(WineGrapeDTO wineGrapeDTO);
    void deleteById(WineGrapeId id);
    List<WineGrapeDTO> findByWineId(Integer wineId);
    List<WineGrapeDTO> findByGrapeId(Integer grapeId);
}