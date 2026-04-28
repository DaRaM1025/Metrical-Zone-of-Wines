package co.edu.unbosque.wines.entity;

import co.edu.unbosque.wines.enums.*;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "regions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Region {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "climate_type")
    private ClimateType climateType;

    @Enumerated(EnumType.STRING)
    @Column(name = "wine_style_profile")
    private WineStyleProfile wineStyleProfile;
}