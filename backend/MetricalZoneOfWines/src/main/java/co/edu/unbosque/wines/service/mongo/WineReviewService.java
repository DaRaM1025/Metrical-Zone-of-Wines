package co.edu.unbosque.wines.service.mongo;

import co.edu.unbosque.wines.document.WineReview;
import co.edu.unbosque.wines.dto.MetricsAggregationDto;
import co.edu.unbosque.wines.repository.mongo.WineReviewRepository;
import co.edu.unbosque.wines.entity.Wine;
import co.edu.unbosque.wines.entity.WineMetric;
import co.edu.unbosque.wines.repository.WineMetricRepository;
import co.edu.unbosque.wines.service.api.RegionMetricService;
import co.edu.unbosque.wines.repository.WineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.ConditionalOperators;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WineReviewService {

    private final WineReviewRepository mongoRepository;
    private final MongoTemplate mongoTemplate;
    private final WineMetricRepository mysqlMetricRepository;
    private final RegionMetricService regionMetricService;
    private final WineRepository wineRepository;

    public List<WineReview> findAll() {
        return mongoRepository.findAll();
    }

    public List<WineReview> findByWineId(Integer wineId) {
        return mongoRepository.findByWineId(wineId);
    }

    @Transactional
    public WineReview save(WineReview review) {
        try {
            if (review.getWineId() == null) throw new RuntimeException("ERROR: wineId obligatorio");

            if (review.getSubmittedAt() == null) review.setSubmittedAt(LocalDateTime.now());

            if (review.getReviewerType() != null) {
                review.setReviewerType(review.getReviewerType().toLowerCase());
            }

            if (review.getReviewYear() == null) {
                review.setReviewYear(review.getSubmittedAt().getYear());
            }

            WineReview savedReview = mongoRepository.save(review);
            updateMysqlMetrics(savedReview.getWineId());

            return savedReview;
        } catch (Exception e) {
            System.err.println("ERROR EN SAVE: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private void updateMysqlMetrics(Integer wineId) {
        try {
            Aggregation aggregation = Aggregation.newAggregation(
                    Aggregation.match(Criteria.where("wine_id").is(wineId)),
                    Aggregation.group("wine_id")
                            .count().as("totalReviews")
                            .avg("score_overall").as("averageScore")
                            .max("score_overall").as("topScore")
                            .avg(ConditionalOperators.Cond.when(Criteria.where("reviewer_type").is("expert"))
                                    .thenValueOf("score_overall")
                                    .otherwise("$$REMOVE")).as("averageExpertScore")
                            .avg(ConditionalOperators.Cond.when(Criteria.where("reviewer_type").is("enthusiast"))
                                    .thenValueOf("score_overall")
                                    .otherwise("$$REMOVE")).as("averageConsumerScore")
            );

            AggregationResults<MetricsAggregationDto> result =
                    mongoTemplate.aggregate(aggregation, "wine_reviews", MetricsAggregationDto.class);

            MetricsAggregationDto newMetrics = result.getUniqueMappedResult();

            if (newMetrics != null) {
                List<WineMetric> existingMetrics = mysqlMetricRepository.findByWineId(wineId);
                WineMetric metricsSql;

                if (!existingMetrics.isEmpty()) {
                    metricsSql = existingMetrics.get(0);
                } else {
                    metricsSql = WineMetric.builder()
                            .wine(Wine.builder().id(wineId).build())
                            .medalCount(0)
                            .totalReviews(0)
                            .build();
                }

                metricsSql.setTotalReviews(newMetrics.getTotalReviews() != null ? newMetrics.getTotalReviews() : 0);
                metricsSql.setAvgScore(toBigDecimal(newMetrics.getAverageScore()));
                metricsSql.setTopScore(toBigDecimal(newMetrics.getTopScore()));
                metricsSql.setAvgExpertScore(toBigDecimal(newMetrics.getAverageExpertScore()));
                metricsSql.setAvgConsumerScore(toBigDecimal(newMetrics.getAverageConsumerScore()));

                // Actualizamos el Prestige Index
                metricsSql.setPrestigeIndex(determinePrestigeIndex(newMetrics.getAverageScore()));

                // --- LOGICA DE MEDALLAS ---
                // Si el top score es > 97, le damos 3 medallas; si es > 93, le damos 1.
                // Esto es solo un ejemplo, puedes ajustarlo a tu gusto.
                if (newMetrics.getTopScore() != null) {
                    if (newMetrics.getTopScore() >= 97.0) {
                        metricsSql.setMedalCount(3);
                    } else if (newMetrics.getTopScore() >= 93.0) {
                        metricsSql.setMedalCount(1);
                    } else {
                        metricsSql.setMedalCount(0);
                    }
                }

                mysqlMetricRepository.save(metricsSql);
                // Disparar la actualización en cascada hacia la Región
                Wine wine = wineRepository.findById(wineId).orElse(null);
                if (wine != null && wine.getVineyard() != null) {
                    regionMetricService.syncRegionMetrics(wine.getVineyard().getRegion().getId());
                }
                System.out.println("Sincronizacion exitosa en MySQL - Vino ID: " + wineId);
            }
        } catch (Exception e) {
            System.err.println("ERROR EN updateMysqlMetrics: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private BigDecimal toBigDecimal(Double value) {
        return value != null ? BigDecimal.valueOf(value) : null;
    }

    private String determinePrestigeIndex(Double avgScore) {
        if (avgScore == null) return "Emerging";
        if (avgScore >= 95.00) return "Legendary";
        if (avgScore >= 90.00) return "Acclaimed";
        if (avgScore >= 85.00) return "Recognized";
        return "Emerging";
    }
}