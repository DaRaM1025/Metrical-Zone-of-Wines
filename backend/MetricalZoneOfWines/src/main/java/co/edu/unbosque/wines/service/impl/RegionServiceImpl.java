package co.edu.unbosque.wines.service.impl;

import co.edu.unbosque.wines.entity.Region;
import co.edu.unbosque.wines.exception.ResourceNotFoundException;
import co.edu.unbosque.wines.repository.RegionRepository;
import co.edu.unbosque.wines.service.api.RegionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegionServiceImpl implements RegionService {

    private final RegionRepository regionRepository;

    @Override
    public List<Region> findAll() {
        return regionRepository.findAll();
    }

    @Override
    public Region findById(Integer id) {
        return regionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la región con ID: " + id));
    }

    @Override
    public Region save(Region region) {
        return regionRepository.save(region);
    }

    @Override
    public void deleteById(Integer id) {
        regionRepository.deleteById(id);
    }

    @Override
    public List<Region> findByCountryId(Integer countryId) {
        return regionRepository.findByCountryId(countryId);
    }
}