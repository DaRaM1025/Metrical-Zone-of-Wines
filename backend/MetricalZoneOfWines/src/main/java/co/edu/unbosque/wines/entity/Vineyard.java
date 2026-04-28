package co.edu.unbosque.wines.entity;

import co.edu.unbosque.wines.enums.*;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "vineyards")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Vineyard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id", nullable = false)
    private Region region;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100)
    private String owner;

    @Column(name = "founded_year")
    private Integer foundedYear;

    @Column(precision = 8, scale = 2)
    private BigDecimal hectares;

    @Column(name = "altitude_avg_m")
    private Integer altitudeAvgM;

    @Enumerated(EnumType.STRING)
    @Column(name = "soil_type")
    private SoilType soilType;

    @Enumerated(EnumType.STRING)
    @Column(name = "irrigation_type")
    private IrrigationType irrigationType;

    @Enumerated(EnumType.STRING)
    @Column(name = "harvest_season")
    private HarvestSeason harvestSeason;

    @Column(precision = 9, scale = 6)
    private BigDecimal lat;

    @Column(precision = 9, scale = 6)
    private BigDecimal lng;

    @Column(length = 255)
    private String website;

    @Column(name = "label_image_url", length = 255)
    private String labelImageUrl;
}