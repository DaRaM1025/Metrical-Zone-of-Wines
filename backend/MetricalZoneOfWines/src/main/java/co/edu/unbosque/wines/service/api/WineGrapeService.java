package co.edu.unbosque.wines.service.api;

import co.edu.unbosque.wines.entity.WineGrape;
import co.edu.unbosque.wines.entity.WineGrapeId;
import java.util.List;

public interface WineGrapeService {
    List<WineGrape> findAll();
    WineGrape findById(WineGrapeId id);
    WineGrape save(WineGrape wineGrape);
    void deleteById(WineGrapeId id);
    List<WineGrape> findByWineId(Integer wineId);
    List<WineGrape> findByGrapeId(Integer grapeId);
}