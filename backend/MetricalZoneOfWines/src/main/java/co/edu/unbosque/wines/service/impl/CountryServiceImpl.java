package co.edu.unbosque.wines.service.impl;

import co.edu.unbosque.wines.entity.Country;
import co.edu.unbosque.wines.exception.ResourceNotFoundException;
import co.edu.unbosque.wines.repository.CountryRepository;
import co.edu.unbosque.wines.service.api.CountryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CountryServiceImpl implements CountryService {

    private final CountryRepository countryRepository;

    @Override
    public List<Country> findAll() {
        return countryRepository.findAll();
    }

    @Override
    public Country findById(Integer id) {
        return countryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el país con ID: " + id));
    }

    @Override
    public Country save(Country country) {
        return countryRepository.save(country);
    }

    @Override
    public void deleteById(Integer id) {
        countryRepository.deleteById(id);
    }
}