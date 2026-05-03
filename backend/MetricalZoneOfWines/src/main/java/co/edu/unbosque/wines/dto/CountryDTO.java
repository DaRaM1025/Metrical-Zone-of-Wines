package co.edu.unbosque.wines.dto;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CountryDTO {
    private Integer id;
    private String name;
    private String code;
}