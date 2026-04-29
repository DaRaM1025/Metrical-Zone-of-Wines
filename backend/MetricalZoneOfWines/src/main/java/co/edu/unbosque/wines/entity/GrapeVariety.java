package co.edu.unbosque.wines.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "grape_varieties")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GrapeVariety {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100, unique = true)
    private String name;

    @Column(name = "color")
    private String color;

    @Column(name = "origin_country", length = 100)
    private String originCountry;
}