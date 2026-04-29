package co.edu.unbosque.wines.repository.mongo;

import co.edu.unbosque.wines.document.WineReview;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WineReviewRepository extends MongoRepository<WineReview, String> {
    // Busca todas las reseñas de un vino específico de MySQL
    List<WineReview> findByWineId(Integer wineId);
}