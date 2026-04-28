package co.edu.unbosque.wines.service.api;

import co.edu.unbosque.wines.entity.Wine;
import java.util.List;

public interface WineService {
    List<Wine> findAll();
    Wine findById(Integer id);
    Wine save(Wine wine);
    void deleteById(Integer id);
    List<Wine> findByVineyardId(Integer vineyardId);
}