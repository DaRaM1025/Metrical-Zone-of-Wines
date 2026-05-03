package co.edu.unbosque.wines.entity;


import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "region_metrics")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RegionMetric {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id", nullable = false)
    private Region region;

    @Column(name = "computed_at", insertable = false, updatable = false)
    private LocalDateTime computedAt;

    @Column(name = "total_vineyards", nullable = false)
    private Integer totalVineyards;

    @Column(name = "total_wines", nullable = false)
    private Integer totalWines;

    @Column(name = "total_reviews", nullable = false)
    private Integer totalReviews;

    @Column(name = "avg_score", precision = 5, scale = 2)
    private BigDecimal avgScore;

    @Column(name = "top_score", precision = 5, scale = 2)
    private BigDecimal topScore;

    @Column(name = "avg_expert_score", precision = 5, scale = 2)
    private BigDecimal avgExpertScore;

    @Column(name = "avg_consumer_score", precision = 5, scale = 2)
    private BigDecimal avgConsumerScore;

    @Column(name = "avg_price_usd", precision = 8, scale = 2)
    private BigDecimal avgPriceUsd;

    @Column(name = "price_range")
    private String priceRange;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dominant_grape_id")
    private GrapeVariety dominantGrape;

    @Column(name = "best_vintage_year")
    private Integer bestVintageYear;

    @Column(name = "prestige_index")
    private String prestigeIndex;

    @Column(name = "medal_count", nullable = false)
    private Integer medalCount;
}