package co.edu.unbosque.wines.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.Date;

@Document(collection = "vineyard_reviews")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VineyardReview {

    @Id
    private String id;

    @Field("reviewer_type")
    private String reviewerType;

    @Field("reviewer_name")
    private String reviewerName;

    @Field("vineyard_id")
    private Integer vineyardId;

    @Field("visit_date")
    private Date visitDate;

    @Field("score_overall")
    private Double scoreOverall;

    @Field("submitted_at")
    private LocalDateTime submittedAt;

    // Campos exclusivos de Expert
    private String occupation;
    private String organization;
    private Integer yearsExperience;
    private String tastingNotes;
    private String pairingSuggestions;

    // Campos exclusivos de Enthusiast
    private String experienceDescription;
    private Boolean wouldRecommend;
}