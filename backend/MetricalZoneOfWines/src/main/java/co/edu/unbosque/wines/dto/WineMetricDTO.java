package co.edu.unbosque.wines.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class WineMetricDTO {
    private Integer id;
    private LocalDateTime computedAt;
    private Integer totalReviews;
    private BigDecimal avgScore;
    private BigDecimal topScore;
    private BigDecimal avgExpertScore;
    private BigDecimal avgConsumerScore;
    private Integer medalCount;
    private String prestigeIndex;

    // Vino anidado
    private WineDTO wine;
}