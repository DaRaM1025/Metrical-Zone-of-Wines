package co.edu.unbosque.wines.dto;

import lombok.Data;

@Data
public class MetricsAggregationDto {
    private Integer totalReviews;
    private Double averageScore;
    private Double topScore;
    private Double averageExpertScore; // Debe coincidir con .as("averageExpertScore")
    private Double averageConsumerScore; // Debe coincidir con .as("averageConsumerScore")
}