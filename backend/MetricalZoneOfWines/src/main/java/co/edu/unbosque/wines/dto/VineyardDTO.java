package co.edu.unbosque.wines.dto;

import lombok.*;
import java.math.BigDecimal;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class VineyardDTO {
    private Integer id;
    private String name;
    private String owner;
    private Integer foundedYear;
    private BigDecimal hectares;
    private Integer altitudeAvgM;
    private String soilType;
    private String irrigationType;
    private String harvestSeason;
    private BigDecimal lat;
    private BigDecimal lng;
    private String website;
    private String labelImageUrl;

    // regiOn
    private RegionDTO region;
}