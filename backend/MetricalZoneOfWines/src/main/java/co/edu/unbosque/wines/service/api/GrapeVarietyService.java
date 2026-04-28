package co.edu.unbosque.wines.service.api;

import co.edu.unbosque.wines.entity.GrapeVariety;
import java.util.List;

public interface GrapeVarietyService {
    List<GrapeVariety> findAll();
    GrapeVariety findById(Integer id);
    GrapeVariety save(GrapeVariety grapeVariety);
    void deleteById(Integer id);
}