package co.edu.unbosque.wines.service.impl;

import co.edu.unbosque.wines.repository.DatabaseFunctionRepository;
import co.edu.unbosque.wines.service.api.DatabaseFunctionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // Le decimos a Spring que estas funciones solo leen datos
public class DatabaseFunctionServiceImpl implements DatabaseFunctionService {

    private final DatabaseFunctionRepository functionRepository;

    @Override
    public String getPriceRange(BigDecimal price) { return functionRepository.getPriceRange(price); }

    @Override
    public String getPrestigeIndex(BigDecimal score) { return functionRepository.getPrestigeIndex(score); }

    @Override
    public Integer calculateVintageAge(Integer vintageYear) { return functionRepository.calculateVintageAge(vintageYear); }

    @Override
    public Integer getDominantGrapeForWine(Integer wineId) { return functionRepository.getDominantGrapeForWine(wineId); }

    @Override
    public BigDecimal calculateEstimatedRevenue(Integer wineId) { return functionRepository.calculateEstimatedRevenue(wineId); }

    @Override
    public Integer getVineyardAge(Integer foundedYear) { return functionRepository.getVineyardAge(foundedYear); }

    @Override
    public String formatWineLabel(String name, Integer vintage, BigDecimal alcohol) { return functionRepository.formatWineLabel(name, vintage, alcohol); }

    @Override
    public Integer getTotalBottlesByVineyard(Integer vineyardId) { return functionRepository.getTotalBottlesByVineyard(vineyardId); }

    @Override
    public BigDecimal convertHectaresToAcres(BigDecimal hectares) { return functionRepository.convertHectaresToAcres(hectares); }

    @Override
    public Boolean checkNeedsDecanting(String wineType, Integer agingMonths) { return functionRepository.checkNeedsDecanting(wineType, agingMonths); }
}