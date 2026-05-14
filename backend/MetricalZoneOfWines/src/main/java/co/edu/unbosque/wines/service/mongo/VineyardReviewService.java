package co.edu.unbosque.wines.service.mongo;

import co.edu.unbosque.wines.document.VineyardReview;
import co.edu.unbosque.wines.dto.VineyardMetricsAggregationDto;
import co.edu.unbosque.wines.repository.mongo.VineyardReviewRepository;
import co.edu.unbosque.wines.entity.Vineyard;
import co.edu.unbosque.wines.entity.VineyardMetric;
import co.edu.unbosque.wines.entity.Wine;
import co.edu.unbosque.wines.repository.VineyardMetricRepository;
import co.edu.unbosque.wines.repository.WineRepository; // Asegúrate de tener este repo

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
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VineyardReviewService {

    private final VineyardReviewRepository mongoRepository;
    private final MongoTemplate mongoTemplate;
    private final VineyardMetricRepository mysqlMetricRepository;
    private final WineRepository wineRepository; // Para la lógica técnica de MySQL

    public List<VineyardReview> findAll() {
        return mongoRepository.findAll();
    }

    public List<VineyardReview> findByVineyardId(Integer vineyardId) {
        return mongoRepository.findByVineyardId(vineyardId);
    }

    @Transactional
    public VineyardReview save(VineyardReview review) {
        try {
            if (review.getVineyardId() == null) throw new RuntimeException("ERROR: vineyardId obligatorio");

            // 1. DATA HEALING (Limpieza y valores por defecto)
            if (review.getSubmittedAt() == null) review.setSubmittedAt(LocalDateTime.now());

            // Si David no manda fecha de visita desde el front, le clavamos la de hoy
            if (review.getVisitDate() == null) review.setVisitDate(new java.util.Date());

            if (review.getReviewerType() != null) {
                review.setReviewerType(review.getReviewerType().toLowerCase());
            }

            // 2. Guardar en Mongo
            VineyardReview savedReview = mongoRepository.save(review);

            // 3. Sincronizar analítica con MySQL
            updateMysqlMetrics(savedReview.getVineyardId());

            return savedReview;
        } catch (Exception e) {
            System.err.println("ERROR EN SAVE VINEDO: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private void updateMysqlMetrics(Integer vineyardId) {
        try {
            // A. AGREGACIÓN EN MONGO (Reviews)
            Aggregation aggregation = Aggregation.newAggregation(
                    Aggregation.match(Criteria.where("vineyard_id").is(vineyardId)),
                    Aggregation.group("vineyard_id")
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

            AggregationResults<VineyardMetricsAggregationDto> result =
                    mongoTemplate.aggregate(aggregation, "vineyard_reviews", VineyardMetricsAggregationDto.class);

            VineyardMetricsAggregationDto newMetrics = result.getUniqueMappedResult();

            if (newMetrics != null) {
                // B. CONSULTA TÉCNICA EN MYSQL (Vinos asociados)
                List<Wine> vineyardWines = wineRepository.findByVineyardId(vineyardId);

                List<VineyardMetric> existingMetrics = mysqlMetricRepository.findByVineyardId(vineyardId);
                VineyardMetric metricsSql = !existingMetrics.isEmpty() ? existingMetrics.get(0) :
                        VineyardMetric.builder().vineyard(Vineyard.builder().id(vineyardId).build()).medalCount(0).build();

                // Seteo de datos de reseñas (Mongo)
                metricsSql.setTotalReviews(newMetrics.getTotalReviews());
                metricsSql.setAvgScore(toBigDecimal(newMetrics.getAverageScore()));
                metricsSql.setTopScore(toBigDecimal(newMetrics.getTopScore()));
                metricsSql.setAvgExpertScore(toBigDecimal(newMetrics.getAverageExpertScore()));
                metricsSql.setAvgConsumerScore(toBigDecimal(newMetrics.getAverageConsumerScore()));
                metricsSql.setPrestigeIndex(determinePrestigeIndex(newMetrics.getAverageScore()));

                // Seteo de datos técnicos (MySQL)
                if (!vineyardWines.isEmpty()) {
                    metricsSql.setTotalWines(vineyardWines.size());

                    // Promedio de añejamiento (Stream)
                    double avgAging = vineyardWines.stream()
                            .filter(w -> w.getAgingMonths() != null)
                            .mapToInt(Wine::getAgingMonths)
                            .average().orElse(0.0);
                    metricsSql.setAvgAgingMonths(BigDecimal.valueOf(avgAging));

                    // Tipo de vino dominante (Moda)
                    String dominantType = vineyardWines.stream()
                            .filter(w -> w.getWineType() != null)
                            .collect(Collectors.groupingBy(Wine::getWineType, Collectors.counting()))
                            .entrySet().stream()
                            .max(Map.Entry.comparingByValue())
                            .map(Map.Entry::getKey).orElse(null);
                    metricsSql.setTopWineType(dominantType);
                }

                // Lógica de Medallas
                if (newMetrics.getTopScore() != null) {
                    if (newMetrics.getTopScore() >= 96.0) metricsSql.setMedalCount(5);
                    else if (newMetrics.getTopScore() >= 92.0) metricsSql.setMedalCount(2);
                }

                mysqlMetricRepository.save(metricsSql);
                System.out.println("Sincronizacion exitosa - Vinedo ID: " + vineyardId);
            }
        } catch (Exception e) {
            System.err.println("ERROR EN updateMysqlMetrics Vinedo: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private BigDecimal toBigDecimal(Double value) {
        return value != null ? BigDecimal.valueOf(value) : null;
    }

    private String determinePrestigeIndex(Double avgScore) {
        if (avgScore == null) return "Emerging";
        if (avgScore >= 94.00) return "Legendary";
        if (avgScore >= 88.00) return "Acclaimed";
        if (avgScore >= 82.00) return "Recognized";
        return "Emerging";
    }
}