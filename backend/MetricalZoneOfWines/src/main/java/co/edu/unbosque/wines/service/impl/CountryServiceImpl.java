package co.edu.unbosque.wines.service.impl;

import co.edu.unbosque.wines.dto.CountryDTO;
import co.edu.unbosque.wines.entity.Country;
import co.edu.unbosque.wines.repository.CountryRepository;
import co.edu.unbosque.wines.service.api.CountryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CountryServiceImpl implements CountryService {

    private final CountryRepository countryRepository;

    @Override
    public List<CountryDTO> findAll() {
        return countryRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CountryDTO findById(Integer id) {
        Country country = countryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("País no encontrado"));
        return toDTO(country);
    }

    @Override
    public CountryDTO save(CountryDTO countryDTO) {
        Country country = toEntity(countryDTO);
        Country savedCountry = countryRepository.save(country);
        return toDTO(savedCountry);
    }

    @Override
    public void deleteById(Integer id) {
        countryRepository.deleteById(id);
    }

    // MAPPERS
    private CountryDTO toDTO(Country entity) {
        return CountryDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .code(entity.getCode())
                .build();
    }

    private Country toEntity(CountryDTO dto) {
        return Country.builder()
                .id(dto.getId())
                .name(dto.getName())
                .code(dto.getCode())
                .build();
    }
}