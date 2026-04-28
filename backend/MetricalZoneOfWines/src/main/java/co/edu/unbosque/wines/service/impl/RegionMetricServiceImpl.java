package co.edu.unbosque.wines.service.impl;

import co.edu.unbosque.wines.exception.ResourceNotFoundException;
import co.edu.unbosque.wines.entity.RegionMetric;
import co.edu.unbosque.wines.repository.RegionMetricRepository;
import co.edu.unbosque.wines.service.api.RegionMetricService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegionMetricServiceImpl implements RegionMetricService {

    private final RegionMetricRepository regionMetricRepository;

    @Override
    public List<RegionMetric> findAll() {
        return regionMetricRepository.findAll();
    }

    @Override
    public RegionMetric findById(Integer id) {
        return regionMetricRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontraron métricas de región con ID: " + id));
    }

    @Override
    public RegionMetric save(RegionMetric regionMetric) {
        return regionMetricRepository.save(regionMetric);
    }

    @Override
    public void deleteById(Integer id) {
        regionMetricRepository.deleteById(id);
    }

    @Override
    public List<RegionMetric> findByRegionId(Integer regionId) {
        return regionMetricRepository.findByRegionId(regionId);
    }
}