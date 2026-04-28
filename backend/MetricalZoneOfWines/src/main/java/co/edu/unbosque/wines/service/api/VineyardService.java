package co.edu.unbosque.wines.service.api;

import co.edu.unbosque.wines.entity.Vineyard;
import java.util.List;

public interface VineyardService {
    List<Vineyard> findAll();
    Vineyard findById(Integer id);
    Vineyard save(Vineyard vineyard);
    void deleteById(Integer id);
    List<Vineyard> findByRegionId(Integer regionId);
}