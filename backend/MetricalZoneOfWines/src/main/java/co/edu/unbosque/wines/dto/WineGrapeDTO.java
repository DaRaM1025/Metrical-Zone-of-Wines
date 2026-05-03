package co.edu.unbosque.wines.dto;

import lombok.*;
import java.math.BigDecimal;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class WineGrapeDTO {
    private WineDTO wine;
    private GrapeVarietyDTO grape;
    private BigDecimal percentage;
}