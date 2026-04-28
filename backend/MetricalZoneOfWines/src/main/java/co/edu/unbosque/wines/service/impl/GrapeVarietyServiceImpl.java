package co.edu.unbosque.wines.service.impl;

import co.edu.unbosque.wines.entity.GrapeVariety;
import co.edu.unbosque.wines.exception.ResourceNotFoundException;
import co.edu.unbosque.wines.repository.GrapeVarietyRepository;
import co.edu.unbosque.wines.service.api.GrapeVarietyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GrapeVarietyServiceImpl implements GrapeVarietyService {

    private final GrapeVarietyRepository grapeVarietyRepository;

    @Override
    public List<GrapeVariety> findAll() {
        return grapeVarietyRepository.findAll();
    }

    @Override
    public GrapeVariety findById(Integer id) {
        return grapeVarietyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la uva con ID: " + id));
    }

    @Override
    public GrapeVariety save(GrapeVariety grapeVariety) {
        return grapeVarietyRepository.save(grapeVariety);
    }

    @Override
    public void deleteById(Integer id) {
        grapeVarietyRepository.deleteById(id);
    }
}