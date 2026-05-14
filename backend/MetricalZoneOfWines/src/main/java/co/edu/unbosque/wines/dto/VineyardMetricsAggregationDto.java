package co.edu.unbosque.wines.dto;

import lombok.Data;

@Data
public class VineyardMetricsAggregationDto {
    private Integer totalReviews;
    private Double averageScore;
    private Double topScore;
    private Double averageExpertScore;
    private Double averageConsumerScore;
}