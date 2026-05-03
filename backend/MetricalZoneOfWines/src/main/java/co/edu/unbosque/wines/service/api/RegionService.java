package co.edu.unbosque.wines.service.api;

import co.edu.unbosque.wines.dto.RegionDTO;
import java.util.List;

public interface RegionService {
    List<RegionDTO> findAll();
    RegionDTO findById(Integer id);
    RegionDTO save(RegionDTO regionDTO);
    void deleteById(Integer id);
    List<RegionDTO> findByCountryId(Integer countryId);
}