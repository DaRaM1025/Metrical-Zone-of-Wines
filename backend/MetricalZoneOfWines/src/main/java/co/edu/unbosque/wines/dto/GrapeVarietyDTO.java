package co.edu.unbosque.wines.dto;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class GrapeVarietyDTO {
    private Integer id;
    private String name;
    private String color;
    private String originCountry;
}