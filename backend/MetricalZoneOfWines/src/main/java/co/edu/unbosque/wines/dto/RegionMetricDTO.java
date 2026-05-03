package co.edu.unbosque.wines.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class RegionMetricDTO {
    private Integer id;
    private LocalDateTime computedAt;
    private Integer totalVineyards;
    private Integer totalWines;
    private Integer totalReviews;
    private BigDecimal avgScore;
    private BigDecimal topScore;
    private BigDecimal avgExpertScore;
    private BigDecimal avgConsumerScore;
    private BigDecimal avgPriceUsd;
    private String priceRange;
    private Integer bestVintageYear;
    private String prestigeIndex;
    private Integer medalCount;

    // relaciones
    private RegionDTO region;
    private GrapeVarietyDTO dominantGrape;
}