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

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RegionMetricServiceImpl implements RegionMetricService {

    private final RegionMetricRepository metricRepository;

    @Override
    public List<RegionMetricDTO> findAll() {
        return metricRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public RegionMetricDTO findById(Integer id) {
        RegionMetric metric = metricRepository.findById(id).orElseThrow(() -> new RuntimeException("No encontrada"));
        return toDTO(metric);
    }

    @Override
    public List<RegionMetricDTO> findByRegionId(Integer regionId) {
        return metricRepository.findByRegionId(regionId).map(metric -> List.of(toDTO(metric))).orElse(List.of());
    }

    @Override
    public RegionMetricDTO save(RegionMetricDTO regionMetricDTO) {
        RegionMetric metric = toEntity(regionMetricDTO);
        return toDTO(metricRepository.save(metric));
    }

    @Override
    public void deleteById(Integer id) {
        metricRepository.deleteById(id);
    }

    @Override
    public void syncRegionMetrics(Integer regionId) {
        // Quitamos el try-catch para que si falla, el error se vea claro y la transacción aborte bien
        RegionMetricRepository.RegionAggregatedStats stats = metricRepository.getAggregatedStatsByRegion(regionId);
        Integer dominantGrapeId = metricRepository.getDominantGrapeByRegion(regionId);
        Integer bestVintage = metricRepository.getBestVintageByRegion(regionId);

        RegionMetric metric = metricRepository.findByRegionId(regionId)
                .orElse(RegionMetric.builder().region(Region.builder().id(regionId).build()).build());

        metric.setTotalVineyards(stats.getTotalVineyards() != null ? stats.getTotalVineyards() : 0);
        metric.setTotalWines(stats.getTotalWines() != null ? stats.getTotalWines() : 0);
        metric.setTotalReviews(stats.getTotalReviews() != null ? stats.getTotalReviews() : 0);
        metric.setAvgScore(toBigDecimal(stats.getAvgScore()));
        metric.setTopScore(toBigDecimal(stats.getTopScore()));
        metric.setAvgExpertScore(toBigDecimal(stats.getAvgExpertScore()));
        metric.setAvgConsumerScore(toBigDecimal(stats.getAvgConsumerScore()));
        metric.setAvgPriceUsd(toBigDecimal(stats.getAvgPrice()));
        metric.setMedalCount(stats.getMedalCount() != null ? stats.getMedalCount() : 0);

        if (dominantGrapeId != null) {
            metric.setDominantGrape(GrapeVariety.builder().id(dominantGrapeId).build());
        }
        metric.setBestVintageYear(bestVintage);
        metric.setPriceRange(determinePriceRange(stats.getAvgPrice()));
        metric.setPrestigeIndex(determinePrestigeIndex(stats.getAvgScore()));

        metricRepository.save(metric);
    }

    private BigDecimal toBigDecimal(Double value) {
        return value != null ? BigDecimal.valueOf(value) : null;
    }

    private String determinePrestigeIndex(Double avgScore) {
        if (avgScore == null) return "Emerging";
        if (avgScore >= 94.00) return "Legendary";
        if (avgScore >= 88.00) return "Acclaimed";
        if (avgScore >= 82.00) return "Recognized";
        return "Emerging";
    }

    private String determinePriceRange(Double avgPrice) {
        if (avgPrice == null || avgPrice == 0.0) return null;
        if (avgPrice <= 20.00) return "Budget";
        if (avgPrice <= 50.00) return "Mid"; // <--- SINCRONIZADO CON DDL
        if (avgPrice <= 150.00) return "Premium";
        return "Luxury";
    }

    // [Mappers toDTO y toEntity se mantienen igual...]
    private RegionMetricDTO toDTO(RegionMetric entity) {
        if (entity == null) return null;
        return RegionMetricDTO.builder()
                .id(entity.getId())
                .totalVineyards(entity.getTotalVineyards())
                .totalWines(entity.getTotalWines())
                .totalReviews(entity.getTotalReviews())
                .avgScore(entity.getAvgScore())
                .topScore(entity.getTopScore())
                .avgPriceUsd(entity.getAvgPriceUsd())
                .priceRange(entity.getPriceRange())
                .prestigeIndex(entity.getPrestigeIndex())
                .medalCount(entity.getMedalCount())
                .build();
    }

    private RegionMetric toEntity(RegionMetricDTO dto) {
        if (dto == null) return null;
        return RegionMetric.builder()
                .id(dto.getId())
                .totalVineyards(dto.getTotalVineyards())
                .totalWines(dto.getTotalWines())
                .totalReviews(dto.getTotalReviews())
                .avgScore(dto.getAvgScore())
                .topScore(dto.getTopScore())
                .avgPriceUsd(dto.getAvgPriceUsd())
                .priceRange(dto.getPriceRange())
                .prestigeIndex(dto.getPrestigeIndex())
                .medalCount(dto.getMedalCount())
                .build();
    }
}