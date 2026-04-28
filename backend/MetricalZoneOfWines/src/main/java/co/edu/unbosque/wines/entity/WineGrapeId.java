package co.edu.unbosque.wines.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;
import java.io.Serializable;

@Embeddable
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode
public class WineGrapeId implements Serializable {
    @Column(name = "wine_id")
    private Integer wineId;

    @Column(name = "grape_id")
    private Integer grapeId;
}