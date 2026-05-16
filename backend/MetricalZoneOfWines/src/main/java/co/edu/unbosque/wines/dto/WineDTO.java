package co.edu.unbosque.wines.dto;

import lombok.*;
import java.math.BigDecimal;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class WineDTO {
    private Integer id;
    private String name;
    private Integer vintageYear;
    private String wineType;
    private BigDecimal alcoholPct;
    private BigDecimal avgPriceUsd;
    private String priceRange;
    private Integer productionBottles;
    private Integer agingMonths;
    private String agingVessel;
    private Boolean naturalWine;
    private String tastingNotes;
    private String foodPairing;
    private String labelImageUrl;
    private String description;

    // Viñedo
    private VineyardDTO vineyard;
}