package co.edu.unbosque.wines.service.impl;

import co.edu.unbosque.wines.entity.VineyardMetric;
import co.edu.unbosque.wines.exception.ResourceNotFoundException;
import co.edu.unbosque.wines.repository.VineyardMetricRepository;
import co.edu.unbosque.wines.service.api.VineyardMetricService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VineyardMetricServiceImpl implements VineyardMetricService {

    private final VineyardMetricRepository vineyardMetricRepository;

    @Override
    public List<VineyardMetric> findAll() {
        return vineyardMetricRepository.findAll();
    }

    @Override
    public VineyardMetric findById(Integer id) {
        return vineyardMetricRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontraron métricas de viñedo con ID: " + id));
    }

    @Override
    public VineyardMetric save(VineyardMetric vineyardMetric) {
        return vineyardMetricRepository.save(vineyardMetric);
    }

    @Override
    public void deleteById(Integer id) {
        vineyardMetricRepository.deleteById(id);
    }

    @Override
    public List<VineyardMetric> findByVineyardId(Integer vineyardId) {
        return vineyardMetricRepository.findByVineyardId(vineyardId);
    }
}