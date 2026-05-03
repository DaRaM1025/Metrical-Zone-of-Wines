package co.edu.unbosque.wines.service.impl;

import co.edu.unbosque.wines.dto.GrapeVarietyDTO;
import co.edu.unbosque.wines.dto.WineDTO;
import co.edu.unbosque.wines.dto.WineGrapeDTO;
import co.edu.unbosque.wines.entity.GrapeVariety;
import co.edu.unbosque.wines.entity.Wine;
import co.edu.unbosque.wines.entity.WineGrape;
import co.edu.unbosque.wines.entity.WineGrapeId;
import co.edu.unbosque.wines.repository.WineGrapeRepository;
import co.edu.unbosque.wines.service.api.WineGrapeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class WineGrapeServiceImpl implements WineGrapeService {

    private final WineGrapeRepository wineGrapeRepository;

    @Override
    public List<WineGrapeDTO> findAll() {
        return wineGrapeRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public WineGrapeDTO findById(WineGrapeId id) {
        WineGrape wineGrape = wineGrapeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asociación de uva y vino no encontrada"));
        return toDTO(wineGrape);
    }

    @Override
    public List<WineGrapeDTO> findByWineId(Integer wineId) {
        return wineGrapeRepository.findByWineId(wineId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<WineGrapeDTO> findByGrapeId(Integer grapeId) {
        return wineGrapeRepository.findByGrapeId(grapeId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public WineGrapeDTO save(WineGrapeDTO wineGrapeDTO) {
        WineGrape wineGrape = toEntity(wineGrapeDTO);
        WineGrape savedWineGrape = wineGrapeRepository.save(wineGrape);
        return toDTO(savedWineGrape);
    }

    @Override
    public void deleteById(WineGrapeId id) {
        wineGrapeRepository.deleteById(id);
    }

    // --- MAPPERS ---
    private WineGrapeDTO toDTO(WineGrape entity) {
        if (entity == null) return null;

        return WineGrapeDTO.builder()
                .percentage(entity.getPercentage())
                .wine(entity.getWine() != null ? WineDTO.builder()
                                                 .id(entity.getWine().getId())
                                                 .name(entity.getWine().getName())
                                                 .build() : null)
                .grape(entity.getGrape() != null ? GrapeVarietyDTO.builder()
                                                   .id(entity.getGrape().getId())
                                                   .name(entity.getGrape().getName())
                                                   .build() : null)
                .build();
    }

    private WineGrape toEntity(WineGrapeDTO dto) {
        if (dto == null) return null;

        WineGrape wineGrape = new WineGrape();
        wineGrape.setPercentage(dto.getPercentage());

        // Llave compuesta desde los IDs que vengan en el DTO
        if (dto.getWine() != null && dto.getGrape() != null) {
            wineGrape.setId(new WineGrapeId(dto.getWine().getId(), dto.getGrape().getId()));
            wineGrape.setWine(Wine.builder().id(dto.getWine().getId()).build());
            wineGrape.setGrape(GrapeVariety.builder().id(dto.getGrape().getId()).build());
        }

        return wineGrape;
    }
}