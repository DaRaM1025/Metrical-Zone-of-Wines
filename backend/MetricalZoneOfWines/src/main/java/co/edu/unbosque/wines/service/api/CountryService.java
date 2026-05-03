package co.edu.unbosque.wines.service.api;

import co.edu.unbosque.wines.dto.CountryDTO;
import java.util.List;

public interface CountryService {
    List<CountryDTO> findAll();
    CountryDTO findById(Integer id);
    CountryDTO save(CountryDTO countryDTO);
    void deleteById(Integer id);
}