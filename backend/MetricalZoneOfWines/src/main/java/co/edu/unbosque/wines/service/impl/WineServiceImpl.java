package co.edu.unbosque.wines.service.impl;

import co.edu.unbosque.wines.entity.Wine;
import co.edu.unbosque.wines.exception.ResourceNotFoundException;
import co.edu.unbosque.wines.repository.WineRepository;
import co.edu.unbosque.wines.service.api.WineService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WineServiceImpl implements WineService {

    private final WineRepository wineRepository;

    @Override
    public List<Wine> findAll() {
        return wineRepository.findAll();
    }

    @Override
    public Wine findById(Integer id) {
        return wineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el vino con ID: " + id));
    }

    @Override
    public Wine save(Wine wine) {
        return wineRepository.save(wine);
    }

    @Override
    public void deleteById(Integer id) {
        wineRepository.deleteById(id);
    }

    @Override
    public List<Wine> findByVineyardId(Integer vineyardId) {
        return wineRepository.findByVineyardId(vineyardId);
    }
}