package co.edu.unbosque.wines.service.impl;

import co.edu.unbosque.wines.dto.CountryDTO;
import co.edu.unbosque.wines.dto.RegionDTO;
import co.edu.unbosque.wines.entity.Country;
import co.edu.unbosque.wines.entity.Region;
import co.edu.unbosque.wines.repository.RegionRepository;
import co.edu.unbosque.wines.service.api.RegionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RegionServiceImpl implements RegionService {

    private final RegionRepository regionRepository;

    @Override
    public List<RegionDTO> findAll() {
        return regionRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RegionDTO findById(Integer id) {
        Region region = regionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Región no encontrada"));
        return toDTO(region);
    }

    @Override
    public List<RegionDTO> findByCountryId(Integer countryId) {
        return regionRepository.findByCountryId(countryId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RegionDTO save(RegionDTO regionDTO) {
        Region region = toEntity(regionDTO);
        Region savedRegion = regionRepository.save(region);
        return toDTO(savedRegion);
    }

    @Override
    public void deleteById(Integer id) {
        regionRepository.deleteById(id);
    }

    // --- MAPPERS ---
    private RegionDTO toDTO(Region entity) {
        if (entity == null) return null;

        return RegionDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .climateType(entity.getClimateType())
                .wineStyleProfile(entity.getWineStyleProfile())
                .country(entity.getCountry() != null ? CountryDTO.builder()
                                                       .id(entity.getCountry().getId())
                                                       .name(entity.getCountry().getName())
                                                       .code(entity.getCountry().getCode())
                                                       .build() : null)
                .build();
    }

    private Region toEntity(RegionDTO dto) {
        if (dto == null) return null;

        Region region = Region.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .climateType(dto.getClimateType())
                .wineStyleProfile(dto.getWineStyleProfile())
                .build();

        if (dto.getCountry() != null) {
            region.setCountry(Country.builder()
                    .id(dto.getCountry().getId())
                    .build());
        }
        return region;
    }
}