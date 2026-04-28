package co.edu.unbosque.wines.service.impl;

import co.edu.unbosque.wines.entity.WineMetric;
import co.edu.unbosque.wines.exception.ResourceNotFoundException;
import co.edu.unbosque.wines.repository.WineMetricRepository;
import co.edu.unbosque.wines.service.api.WineMetricService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WineMetricServiceImpl implements WineMetricService {

    private final WineMetricRepository wineMetricRepository;

    @Override
    public List<WineMetric> findAll() {
        return wineMetricRepository.findAll();
    }

    @Override
    public WineMetric findById(Integer id) {
        return wineMetricRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontraron métricas de vino con ID: " + id));
    }

    @Override
    public WineMetric save(WineMetric wineMetric) {
        return wineMetricRepository.save(wineMetric);
    }

    @Override
    public void deleteById(Integer id) {
        wineMetricRepository.deleteById(id);
    }

    @Override
    public List<WineMetric> findByWineId(Integer wineId) {
        return wineMetricRepository.findByWineId(wineId);
    }
}