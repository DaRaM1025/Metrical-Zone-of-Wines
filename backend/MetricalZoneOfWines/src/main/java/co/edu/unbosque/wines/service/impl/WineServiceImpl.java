package co.edu.unbosque.wines.service.impl;

import co.edu.unbosque.wines.dto.VineyardDTO;
import co.edu.unbosque.wines.dto.WineDTO;
import co.edu.unbosque.wines.entity.Vineyard;
import co.edu.unbosque.wines.entity.Wine;
import co.edu.unbosque.wines.repository.WineRepository;
import co.edu.unbosque.wines.service.api.WineService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class WineServiceImpl implements WineService {

    private final WineRepository wineRepository;

    @Override
    public List<WineDTO> findAll() {
        return wineRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public WineDTO findById(Integer id) {
        Wine wine = wineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vino no encontrado"));
        return toDTO(wine);
    }

    @Override
    public List<WineDTO> findByVineyardId(Integer vineyardId) {
        return wineRepository.findByVineyardId(vineyardId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public WineDTO save(WineDTO wineDTO) {
        Wine wine = toEntity(wineDTO);
        Wine savedWine = wineRepository.save(wine);
        return toDTO(savedWine);
    }

    @Override
    public void deleteById(Integer id) {
        wineRepository.deleteById(id);
    }

    // --- MAPPERS ---
    private WineDTO toDTO(Wine entity) {
        if (entity == null) return null;

        return WineDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .vintageYear(entity.getVintageYear())
                .wineType(entity.getWineType())
                .alcoholPct(entity.getAlcoholPct())
                .avgPriceUsd(entity.getAvgPriceUsd())
                .priceRange(entity.getPriceRange())
                .productionBottles(entity.getProductionBottles())
                .agingMonths(entity.getAgingMonths())
                .agingVessel(entity.getAgingVessel())
                .naturalWine(entity.getNaturalWine())
                .tastingNotes(entity.getTastingNotes())
                .foodPairing(entity.getFoodPairing())
                .labelImageUrl(entity.getLabelImageUrl())
                .description(entity.getDescription())
                .vineyard(entity.getVineyard() != null ? VineyardDTO.builder()
                                                         .id(entity.getVineyard().getId())
                                                         .name(entity.getVineyard().getName())
                                                         .build() : null)
                .build();
    }

    private Wine toEntity(WineDTO dto) {
        if (dto == null) return null;

        Wine wine = Wine.builder()
                .id(dto.getId())
                .name(dto.getName())
                .vintageYear(dto.getVintageYear())
                .wineType(dto.getWineType())
                .alcoholPct(dto.getAlcoholPct())
                .avgPriceUsd(dto.getAvgPriceUsd())
                .priceRange(dto.getPriceRange())
                .productionBottles(dto.getProductionBottles())
                .agingMonths(dto.getAgingMonths())
                .agingVessel(dto.getAgingVessel())
                .naturalWine(dto.getNaturalWine() != null ? dto.getNaturalWine() : false)
                .tastingNotes(dto.getTastingNotes())
                .foodPairing(dto.getFoodPairing())
                .labelImageUrl(dto.getLabelImageUrl())
                .description(dto.getDescription())
                .build();

        if (dto.getVineyard() != null) {
            wine.setVineyard(Vineyard.builder().id(dto.getVineyard().getId()).build());
        }

        return wine;
    }
}