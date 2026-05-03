package co.edu.unbosque.wines.service.impl;

import co.edu.unbosque.wines.dto.WineDTO;
import co.edu.unbosque.wines.dto.WineMetricDTO;
import co.edu.unbosque.wines.entity.Wine;
import co.edu.unbosque.wines.entity.WineMetric;
import co.edu.unbosque.wines.repository.WineMetricRepository;
import co.edu.unbosque.wines.service.api.WineMetricService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class WineMetricServiceImpl implements WineMetricService {

    private final WineMetricRepository metricRepository;

    @Override
    public List<WineMetricDTO> findAll() {
        return metricRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public WineMetricDTO findById(Integer id) {
        WineMetric metric = metricRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Métrica de vino no encontrada"));
        return toDTO(metric);
    }

    @Override
    public List<WineMetricDTO> findByWineId(Integer wineId) {
        return metricRepository.findByWineId(wineId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public WineMetricDTO save(WineMetricDTO wineMetricDTO) {
        WineMetric metric = toEntity(wineMetricDTO);
        WineMetric savedMetric = metricRepository.save(metric);
        return toDTO(savedMetric);
    }

    @Override
    public void deleteById(Integer id) {
        metricRepository.deleteById(id);
    }

    // --- MAPPERS ---
    private WineMetricDTO toDTO(WineMetric entity) {
        if (entity == null) return null;

        return WineMetricDTO.builder()
                .id(entity.getId())
                .computedAt(entity.getComputedAt())
                .totalReviews(entity.getTotalReviews())
                .avgScore(entity.getAvgScore())
                .topScore(entity.getTopScore())
                .avgExpertScore(entity.getAvgExpertScore())
                .avgConsumerScore(entity.getAvgConsumerScore())
                .medalCount(entity.getMedalCount())
                .prestigeIndex(entity.getPrestigeIndex())
                // Mapeo de vino
                .wine(entity.getWine() != null ? WineDTO.builder()
                                                 .id(entity.getWine().getId())
                                                 .name(entity.getWine().getName())
                                                 .build() : null)
                .build();
    }

    private WineMetric toEntity(WineMetricDTO dto) {
        if (dto == null) return null;

        WineMetric metric = WineMetric.builder()
                .id(dto.getId())
                .totalReviews(dto.getTotalReviews())
                .avgScore(dto.getAvgScore())
                .topScore(dto.getTopScore())
                .avgExpertScore(dto.getAvgExpertScore())
                .avgConsumerScore(dto.getAvgConsumerScore())
                .medalCount(dto.getMedalCount())
                .prestigeIndex(dto.getPrestigeIndex())
                .build();

        if (dto.getWine() != null) {
            metric.setWine(Wine.builder().id(dto.getWine().getId()).build());
        }

        return metric;
    }
}