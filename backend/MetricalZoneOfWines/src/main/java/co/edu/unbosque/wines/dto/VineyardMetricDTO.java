package co.edu.unbosque.wines.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class VineyardMetricDTO {
    private Integer id;
    private LocalDateTime computedAt;
    private Integer totalWines;
    private Integer totalReviews;
    private BigDecimal avgScore;
    private BigDecimal topScore;
    private BigDecimal avgExpertScore;
    private BigDecimal avgConsumerScore;
    private BigDecimal avgPriceUsd;
    private String priceRange;
    private String prestigeIndex;
    private Integer medalCount;
    private String topWineType;
    private BigDecimal avgAgingMonths;

    // Relaciones
    private VineyardDTO vineyard;
    private GrapeVarietyDTO dominantGrape;
}