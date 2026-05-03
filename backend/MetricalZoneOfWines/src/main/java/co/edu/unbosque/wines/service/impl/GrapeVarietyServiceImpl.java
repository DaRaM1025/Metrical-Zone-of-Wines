package co.edu.unbosque.wines.service.impl;

import co.edu.unbosque.wines.dto.GrapeVarietyDTO;
import co.edu.unbosque.wines.entity.GrapeVariety;
import co.edu.unbosque.wines.repository.GrapeVarietyRepository;
import co.edu.unbosque.wines.service.api.GrapeVarietyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class GrapeVarietyServiceImpl implements GrapeVarietyService {

    private final GrapeVarietyRepository grapeVarietyRepository;

    @Override
    public List<GrapeVarietyDTO> findAll() {
        return grapeVarietyRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public GrapeVarietyDTO findById(Integer id) {
        GrapeVariety grapeVariety = grapeVarietyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Variedad de uva no encontrada"));
        return toDTO(grapeVariety);
    }

    @Override
    public GrapeVarietyDTO save(GrapeVarietyDTO grapeVarietyDTO) {
        GrapeVariety grapeVariety = toEntity(grapeVarietyDTO);
        GrapeVariety savedGrapeVariety = grapeVarietyRepository.save(grapeVariety);
        return toDTO(savedGrapeVariety);
    }

    @Override
    public void deleteById(Integer id) {
        grapeVarietyRepository.deleteById(id);
    }

    // --- MAPPERS ---
    private GrapeVarietyDTO toDTO(GrapeVariety entity) {
        return GrapeVarietyDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .color(entity.getColor())
                .originCountry(entity.getOriginCountry())
                .build();
    }

    private GrapeVariety toEntity(GrapeVarietyDTO dto) {
        return GrapeVariety.builder()
                .id(dto.getId())
                .name(dto.getName())
                .color(dto.getColor())
                .originCountry(dto.getOriginCountry())
                .build();
    }
}