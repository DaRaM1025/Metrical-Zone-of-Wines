package co.edu.unbosque.wines.service.api;

import co.edu.unbosque.wines.entity.Region;
import java.util.List;

public interface RegionService {
    List<Region> findAll();
    Region findById(Integer id);
    Region save(Region region);
    void deleteById(Integer id);
    List<Region> findByCountryId(Integer countryId);
}