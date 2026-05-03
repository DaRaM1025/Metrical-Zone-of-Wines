package co.edu.unbosque.wines.service.impl;

import co.edu.unbosque.wines.dto.GrapeVarietyDTO;
import co.edu.unbosque.wines.dto.VineyardDTO;
import co.edu.unbosque.wines.dto.VineyardMetricDTO;
import co.edu.unbosque.wines.entity.GrapeVariety;
import co.edu.unbosque.wines.entity.Vineyard;
import co.edu.unbosque.wines.entity.VineyardMetric;
import co.edu.unbosque.wines.repository.VineyardMetricRepository;
import co.edu.unbosque.wines.service.api.VineyardMetricService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class VineyardMetricServiceImpl implements VineyardMetricService {

    private final VineyardMetricRepository metricRepository;

    @Override
    public List<VineyardMetricDTO> findAll() {
        return metricRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public VineyardMetricDTO findById(Integer id) {
        VineyardMetric metric = metricRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Métrica de viñedo no encontrada"));
        return toDTO(metric);
    }

    @Override
    public List<VineyardMetricDTO> findByVineyardId(Integer vineyardId) {
        return metricRepository.findByVineyardId(vineyardId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public VineyardMetricDTO save(VineyardMetricDTO vineyardMetricDTO) {
        VineyardMetric metric = toEntity(vineyardMetricDTO);
        VineyardMetric savedMetric = metricRepository.save(metric);
        return toDTO(savedMetric);
    }

    @Override
    public void deleteById(Integer id) {
        metricRepository.deleteById(id);
    }

    // --- MAPPERS ---
    private VineyardMetricDTO toDTO(VineyardMetric entity) {
        if (entity == null) return null;

        return VineyardMetricDTO.builder()
                .id(entity.getId())
                .computedAt(entity.getComputedAt())
                .totalWines(entity.getTotalWines())
                .totalReviews(entity.getTotalReviews())
                .avgScore(entity.getAvgScore())
                .topScore(entity.getTopScore())
                .avgExpertScore(entity.getAvgExpertScore())
                .avgConsumerScore(entity.getAvgConsumerScore())
                .avgPriceUsd(entity.getAvgPriceUsd())
                .priceRange(entity.getPriceRange())
                .prestigeIndex(entity.getPrestigeIndex())
                .medalCount(entity.getMedalCount())
                .topWineType(entity.getTopWineType())
                .avgAgingMonths(entity.getAvgAgingMonths())
                .vineyard(entity.getVineyard() != null ? VineyardDTO.builder()
                                                         .id(entity.getVineyard().getId())
                                                         .name(entity.getVineyard().getName())
                                                         .build() : null)
                .dominantGrape(entity.getDominantGrape() != null ? GrapeVarietyDTO.builder()
                                                                   .id(entity.getDominantGrape().getId())
                                                                   .name(entity.getDominantGrape().getName())
                                                                   .build() : null)
                .build();
    }

    private VineyardMetric toEntity(VineyardMetricDTO dto) {
        if (dto == null) return null;

        VineyardMetric metric = VineyardMetric.builder()
                .id(dto.getId())
                .totalWines(dto.getTotalWines())
                .totalReviews(dto.getTotalReviews())
                .avgScore(dto.getAvgScore())
                .topScore(dto.getTopScore())
                .avgExpertScore(dto.getAvgExpertScore())
                .avgConsumerScore(dto.getAvgConsumerScore())
                .avgPriceUsd(dto.getAvgPriceUsd())
                .priceRange(dto.getPriceRange())
                .prestigeIndex(dto.getPrestigeIndex())
                .medalCount(dto.getMedalCount())
                .topWineType(dto.getTopWineType())
                .avgAgingMonths(dto.getAvgAgingMonths())
                .build();

        if (dto.getVineyard() != null) {
            metric.setVineyard(Vineyard.builder().id(dto.getVineyard().getId()).build());
        }
        if (dto.getDominantGrape() != null) {
            metric.setDominantGrape(GrapeVariety.builder().id(dto.getDominantGrape().getId()).build());
        }

        return metric;
    }
}