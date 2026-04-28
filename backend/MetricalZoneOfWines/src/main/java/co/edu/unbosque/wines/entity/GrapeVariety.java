package co.edu.unbosque.wines.entity;

import co.edu.unbosque.wines.enums.*;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "grape_varieties")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GrapeVariety {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100, unique = true)
    private String name;

    @Enumerated(EnumType.STRING)
    private GrapeColor color;

    @Column(name = "origin_country", length = 100)
    private String originCountry;
}