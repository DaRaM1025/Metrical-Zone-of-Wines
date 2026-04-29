package co.edu.unbosque.wines.entity;


import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "wine_metrics")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WineMetric {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wine_id", nullable = false)
    private Wine wine;

    @Column(name = "computed_at", insertable = false, updatable = false)
    private LocalDateTime computedAt;

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

    @Column(name = "medal_count", nullable = false)
    private Integer medalCount;

    @Column(name = "prestige_index")
    private String prestigeIndex;
}