package co.edu.unbosque.wines.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
@RequiredArgsConstructor
public class DatabaseFunctionRepository {

    private final JdbcTemplate jdbcTemplate;

    public String getPriceRange(BigDecimal price) {
        return jdbcTemplate.queryForObject("SELECT fn_get_price_range(?)", String.class, price);
    }

    public String getPrestigeIndex(BigDecimal score) {
        return jdbcTemplate.queryForObject("SELECT fn_determine_prestige_index(?)", String.class, score);
    }

    public Integer calculateVintageAge(Integer vintageYear) {
        return jdbcTemplate.queryForObject("SELECT fn_calculate_vintage_age(?)", Integer.class, vintageYear);
    }

    public Integer getDominantGrapeForWine(Integer wineId) {
        return jdbcTemplate.queryForObject("SELECT fn_get_dominant_grape_for_wine(?)", Integer.class, wineId);
    }

    public BigDecimal calculateEstimatedRevenue(Integer wineId) {
        return jdbcTemplate.queryForObject("SELECT fn_calculate_estimated_revenue(?)", BigDecimal.class, wineId);
    }

    public Integer getVineyardAge(Integer foundedYear) {
        return jdbcTemplate.queryForObject("SELECT fn_get_vineyard_age(?)", Integer.class, foundedYear);
    }

    public String formatWineLabel(String name, Integer vintage, BigDecimal alcohol) {
        return jdbcTemplate.queryForObject("SELECT fn_format_wine_label(?, ?, ?)", String.class, name, vintage, alcohol);
    }

    public Integer getTotalBottlesByVineyard(Integer vineyardId) {
        return jdbcTemplate.queryForObject("SELECT fn_get_total_bottles_by_vineyard(?)", Integer.class, vineyardId);
    }

    public BigDecimal convertHectaresToAcres(BigDecimal hectares) {
        return jdbcTemplate.queryForObject("SELECT fn_convert_hectares_to_acres(?)", BigDecimal.class, hectares);
    }

    public Boolean checkNeedsDecanting(String wineType, Integer agingMonths) {
        Integer result = jdbcTemplate.queryForObject("SELECT fn_check_needs_decanting(?, ?)", Integer.class, wineType, agingMonths);
        return result != null && result == 1;
    }
}