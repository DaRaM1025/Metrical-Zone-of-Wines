package co.edu.unbosque.wines.entity;


import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "wines")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Wine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vineyard_id", nullable = false)
    private Vineyard vineyard;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "vintage_year")
    private Integer vintageYear;

    @Column(name = "wine_type")
    private String wineType;

    @Column(name = "alcohol_pct", precision = 4, scale = 2)
    private BigDecimal alcoholPct;

    @Column(name = "avg_price_usd", precision = 8, scale = 2)
    private BigDecimal avgPriceUsd;

    @Column(name = "price_range")
    private String priceRange;

    @Column(name = "production_bottles")
    private Integer productionBottles;

    @Column(name = "aging_months")
    private Integer agingMonths;

    @Column(name = "aging_vessel")
    private String agingVessel;

    @Column(name = "natural_wine", nullable = false)
    private Boolean naturalWine;

    @Column(name = "tasting_notes", columnDefinition = "TEXT")
    private String tastingNotes;

    @Column(name = "food_pairing", columnDefinition = "TEXT")
    private String foodPairing;

    @Column(name = "label_image_url", length = 255)
    private String labelImageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;
}