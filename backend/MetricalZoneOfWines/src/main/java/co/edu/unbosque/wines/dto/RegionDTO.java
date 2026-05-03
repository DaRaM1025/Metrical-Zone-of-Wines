package co.edu.unbosque.wines.dto;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class RegionDTO {
    private Integer id;
    private String name;
    private String description;
    private String climateType;
    private String wineStyleProfile;

    // DTO de Country ANIDADO
    private CountryDTO country;
}