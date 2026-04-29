package co.edu.unbosque.wines.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "wine_grapes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WineGrape {
    @EmbeddedId
    private WineGrapeId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("wineId")
    @JoinColumn(name = "wine_id")
    private Wine wine;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("grapeId")
    @JoinColumn(name = "grape_id")
    private GrapeVariety grape;

    @Column(precision = 5, scale = 2)
    private BigDecimal percentage;
}