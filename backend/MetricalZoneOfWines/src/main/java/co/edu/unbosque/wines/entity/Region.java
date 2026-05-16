package co.edu.unbosque.wines.entity;


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


    @Column(name = "climate_type")
    private String climateType;


    @Column(name = "wine_style_profile")
    private String wineStyleProfile;
}