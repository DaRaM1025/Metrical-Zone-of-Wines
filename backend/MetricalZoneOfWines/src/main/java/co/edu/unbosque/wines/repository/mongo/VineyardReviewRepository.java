package co.edu.unbosque.wines.repository.mongo;

import co.edu.unbosque.wines.document.VineyardReview;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VineyardReviewRepository extends MongoRepository<VineyardReview, String> {
    // Busca todas las reseñas de un viñedo específico de MySQL
    List<VineyardReview> findByVineyardId(Integer vineyardId);
}