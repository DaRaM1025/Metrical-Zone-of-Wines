package co.edu.unbosque.wines.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "wine_reviews")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WineReview {

    @Id
    private String id;

    @Field("reviewer_type")
    private String reviewerType;

    @Field("reviewer_name")
    private String reviewerName;

    @Field("wine_id")
    private Integer wineId;

    @Field("score_overall")
    private Double scoreOverall;

    @Field("submitted_at")
    private LocalDateTime submittedAt;

    // Campos exclusivos de Expert
    private String occupation;
    private String organization;
    private Integer yearsExperience;
    private Integer reviewYear;

    // El objeto 'scores' (color, aroma, etc.) lo manejamos como un Map
    private Map<String, Double> scores;

    private String tastingNotes;
    private String pairingSuggestions;

    // Campos exclusivos de Enthusiast
    private String experienceDescription;
    private String consumptionOccasion;
    private Boolean wouldRecommend;
}