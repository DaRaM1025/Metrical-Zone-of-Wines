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

    @Field("years_experience")
    private Integer yearsExperience;

    @Field("review_year")
    private Integer reviewYear;

    // El objeto 'scores' (color, aroma, etc.) lo manejamos como un Map
    private Map<String, Double> scores;

    @Field("tasting_notes")
    private String tastingNotes;

    @Field("pairing_suggestions")
    private String pairingSuggestions;

    // Campos exclusivos de Enthusiast
    @Field("experience_description")
    private String experienceDescription;

    @Field("consumption_occasion")
    private String consumptionOccasion;

    @Field("would_recommend")
    private Boolean wouldRecommend;
}