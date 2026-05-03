package co.edu.unbosque.wines.service.impl;

import co.edu.unbosque.wines.dto.RegionDTO;
import co.edu.unbosque.wines.dto.VineyardDTO;
import co.edu.unbosque.wines.entity.Region;
import co.edu.unbosque.wines.entity.Vineyard;
import co.edu.unbosque.wines.repository.VineyardRepository;
import co.edu.unbosque.wines.service.api.VineyardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class VineyardServiceImpl implements VineyardService {

    private final VineyardRepository vineyardRepository;

    @Override
    public List<VineyardDTO> findAll() {
        return vineyardRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public VineyardDTO findById(Integer id) {
        Vineyard vineyard = vineyardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Viñedo no encontrado"));
        return toDTO(vineyard);
    }

    @Override
    public List<VineyardDTO> findByRegionId(Integer regionId) {
        return vineyardRepository.findByRegionId(regionId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public VineyardDTO save(VineyardDTO vineyardDTO) {
        Vineyard vineyard = toEntity(vineyardDTO);
        Vineyard savedVineyard = vineyardRepository.save(vineyard);
        return toDTO(savedVineyard);
    }

    @Override
    public void deleteById(Integer id) {
        vineyardRepository.deleteById(id);
    }

    // --- MAPPERS ---
    private VineyardDTO toDTO(Vineyard entity) {
        if (entity == null) return null;

        return VineyardDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .owner(entity.getOwner())
                .foundedYear(entity.getFoundedYear())
                .hectares(entity.getHectares())
                .altitudeAvgM(entity.getAltitudeAvgM())
                .soilType(entity.getSoilType())
                .irrigationType(entity.getIrrigationType())
                .harvestSeason(entity.getHarvestSeason())
                .lat(entity.getLat())
                .lng(entity.getLng())
                .website(entity.getWebsite())
                .labelImageUrl(entity.getLabelImageUrl())
                .region(entity.getRegion() != null ? RegionDTO.builder()
                                                     .id(entity.getRegion().getId())
                                                     .name(entity.getRegion().getName())
                                                     .build() : null)
                .build();
    }

    private Vineyard toEntity(VineyardDTO dto) {
        if (dto == null) return null;

        Vineyard vineyard = Vineyard.builder()
                .id(dto.getId())
                .name(dto.getName())
                .owner(dto.getOwner())
                .foundedYear(dto.getFoundedYear())
                .hectares(dto.getHectares())
                .altitudeAvgM(dto.getAltitudeAvgM())
                .soilType(dto.getSoilType())
                .irrigationType(dto.getIrrigationType())
                .harvestSeason(dto.getHarvestSeason())
                .lat(dto.getLat())
                .lng(dto.getLng())
                .website(dto.getWebsite())
                .labelImageUrl(dto.getLabelImageUrl())
                .build();

        if (dto.getRegion() != null) {
            vineyard.setRegion(Region.builder().id(dto.getRegion().getId()).build());
        }

        return vineyard;
    }
}