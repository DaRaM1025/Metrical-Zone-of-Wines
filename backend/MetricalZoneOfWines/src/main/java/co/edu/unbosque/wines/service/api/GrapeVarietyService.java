package co.edu.unbosque.wines.service.api;

import co.edu.unbosque.wines.dto.GrapeVarietyDTO;
import java.util.List;

public interface GrapeVarietyService {
    List<GrapeVarietyDTO> findAll();
    GrapeVarietyDTO findById(Integer id);
    GrapeVarietyDTO save(GrapeVarietyDTO grapeVarietyDTO);
    void deleteById(Integer id);
}