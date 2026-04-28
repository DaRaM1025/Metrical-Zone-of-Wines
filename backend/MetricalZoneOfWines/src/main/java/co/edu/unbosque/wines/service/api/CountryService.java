package co.edu.unbosque.wines.service.api;

import co.edu.unbosque.wines.entity.Country;
import java.util.List;

public interface CountryService {
    List<Country> findAll();
    Country findById(Integer id);
    Country save(Country country);
    void deleteById(Integer id);
}