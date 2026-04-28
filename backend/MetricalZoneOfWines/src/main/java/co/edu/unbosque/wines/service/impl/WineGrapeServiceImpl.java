package co.edu.unbosque.wines.service.impl;

import co.edu.unbosque.wines.entity.WineGrape;
import co.edu.unbosque.wines.entity.WineGrapeId;
import co.edu.unbosque.wines.exception.ResourceNotFoundException;
import co.edu.unbosque.wines.repository.WineGrapeRepository;
import co.edu.unbosque.wines.service.api.WineGrapeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WineGrapeServiceImpl implements WineGrapeService {

    private final WineGrapeRepository wineGrapeRepository;

    @Override
    public List<WineGrape> findAll() {
        return wineGrapeRepository.findAll();
    }

    @Override
    public WineGrape findById(WineGrapeId id) {
        return wineGrapeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la relación vino-uva"));
    }

    @Override
    public WineGrape save(WineGrape wineGrape) {
        return wineGrapeRepository.save(wineGrape);
    }

    @Override
    public void deleteById(WineGrapeId id) {
        wineGrapeRepository.deleteById(id);
    }

    @Override
    public List<WineGrape> findByWineId(Integer wineId) {
        return wineGrapeRepository.findByWineId(wineId);
    }

    @Override
    public List<WineGrape> findByGrapeId(Integer grapeId) {
        return wineGrapeRepository.findByGrapeId(grapeId);
    }
}