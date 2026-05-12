package co.edu.unbosque.wines.service.api;

import java.math.BigDecimal;

public interface DatabaseFunctionService {
    String getPriceRange(BigDecimal price);
    String getPrestigeIndex(BigDecimal score);
    Integer calculateVintageAge(Integer vintageYear);
    Integer getDominantGrapeForWine(Integer wineId);
    BigDecimal calculateEstimatedRevenue(Integer wineId);
    Integer getVineyardAge(Integer foundedYear);
    String formatWineLabel(String name, Integer vintage, BigDecimal alcohol);
    Integer getTotalBottlesByVineyard(Integer vineyardId);
    BigDecimal convertHectaresToAcres(BigDecimal hectares);
    Boolean checkNeedsDecanting(String wineType, Integer agingMonths);
}