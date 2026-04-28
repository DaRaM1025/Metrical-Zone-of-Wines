package co.edu.unbosque.wines.service.impl;

import co.edu.unbosque.wines.entity.Vineyard;
import co.edu.unbosque.wines.exception.ResourceNotFoundException;
import co.edu.unbosque.wines.repository.VineyardRepository;
import co.edu.unbosque.wines.service.api.VineyardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VineyardServiceImpl implements VineyardService {

    private final VineyardRepository vineyardRepository;

    @Override
    public List<Vineyard> findAll() {
        return vineyardRepository.findAll();
    }

    @Override
    public Vineyard findById(Integer id) {
        return vineyardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el viñedo con ID: " + id));
    }

    @Override
    public Vineyard save(Vineyard vineyard) {
        return vineyardRepository.save(vineyard);
    }

    @Override
    public void deleteById(Integer id) {
        vineyardRepository.deleteById(id);
    }

    @Override
    public List<Vineyard> findByRegionId(Integer regionId) {
        return vineyardRepository.findByRegionId(regionId);
    }
}