package co.edu.unbosque.wines.service.impl;

import co.edu.unbosque.wines.dto.GrapeVarietyDTO;
import co.edu.unbosque.wines.dto.RegionDTO;
import co.edu.unbosque.wines.dto.RegionMetricDTO;
import co.edu.unbosque.wines.entity.GrapeVariety;
import co.edu.unbosque.wines.entity.Region;
import co.edu.unbosque.wines.entity.RegionMetric;
import co.edu.unbosque.wines.repository.RegionMetricRepository;
import co.edu.unbosque.wines.service.api.RegionMetricService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RegionMetricServiceImpl implements RegionMetricService {

    private final RegionMetricRepository metricRepository;

    @Override
    public List<RegionMetricDTO> findAll() {
        return metricRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RegionMetricDTO findById(Integer id) {
        RegionMetric metric = metricRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Métrica de región no encontrada"));
        return toDTO(metric);
    }

    @Override
    public List<RegionMetricDTO> findByRegionId(Integer regionId) {
        return metricRepository.findByRegionId(regionId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RegionMetricDTO save(RegionMetricDTO regionMetricDTO) {
        RegionMetric metric = toEntity(regionMetricDTO);
        RegionMetric savedMetric = metricRepository.save(metric);
        return toDTO(savedMetric);
    }

    @Override
    public void deleteById(Integer id) {
        metricRepository.deleteById(id);
    }

    // --- MAPPERS ---
    private RegionMetricDTO toDTO(RegionMetric entity) {
        if (entity == null) return null;

        return RegionMetricDTO.builder()
                .id(entity.getId())
                .computedAt(entity.getComputedAt())
                .totalVineyards(entity.getTotalVineyards())
                .totalWines(entity.getTotalWines())
                .totalReviews(entity.getTotalReviews())
                .avgScore(entity.getAvgScore())
                .topScore(entity.getTopScore())
                .avgExpertScore(entity.getAvgExpertScore())
                .avgConsumerScore(entity.getAvgConsumerScore())
                .avgPriceUsd(entity.getAvgPriceUsd())
                .priceRange(entity.getPriceRange())
                .bestVintageYear(entity.getBestVintageYear())
                .prestigeIndex(entity.getPrestigeIndex())
                .medalCount(entity.getMedalCount())
                // Mapeo manual rápido para evitar dependencias circulares
                .region(entity.getRegion() != null ? RegionDTO.builder()
                                                     .id(entity.getRegion().getId())
                                                     .name(entity.getRegion().getName())
                                                     .build() : null)
                .dominantGrape(entity.getDominantGrape() != null ? GrapeVarietyDTO.builder()
                                                                   .id(entity.getDominantGrape().getId())
                                                                   .name(entity.getDominantGrape().getName())
                                                                   .build() : null)
                .build();
    }

    private RegionMetric toEntity(RegionMetricDTO dto) {
        if (dto == null) return null;

        RegionMetric metric = RegionMetric.builder()
                .id(dto.getId())
                .totalVineyards(dto.getTotalVineyards())
                .totalWines(dto.getTotalWines())
                .totalReviews(dto.getTotalReviews())
                .avgScore(dto.getAvgScore())
                .topScore(dto.getTopScore())
                .avgExpertScore(dto.getAvgExpertScore())
                .avgConsumerScore(dto.getAvgConsumerScore())
                .avgPriceUsd(dto.getAvgPriceUsd())
                .priceRange(dto.getPriceRange())
                .bestVintageYear(dto.getBestVintageYear())
                .prestigeIndex(dto.getPrestigeIndex())
                .medalCount(dto.getMedalCount())
                .build();

        if (dto.getRegion() != null) {
            metric.setRegion(Region.builder().id(dto.getRegion().getId()).build());
        }
        if (dto.getDominantGrape() != null) {
            metric.setDominantGrape(GrapeVariety.builder().id(dto.getDominantGrape().getId()).build());
        }

        return metric;
    }
}