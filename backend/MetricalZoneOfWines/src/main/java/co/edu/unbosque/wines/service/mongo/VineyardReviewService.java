package co.edu.unbosque.wines.service.mongo;

import co.edu.unbosque.wines.document.VineyardReview;
import co.edu.unbosque.wines.repository.mongo.VineyardReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VineyardReviewService {
    private final VineyardReviewRepository repository;

    public List<VineyardReview> findAll() {
        return repository.findAll();
    }

    public List<VineyardReview> findByVineyardId(Integer vineyardId) {
        return repository.findByVineyardId(vineyardId);
    }

    public VineyardReview save(VineyardReview review) {
        if (review.getSubmittedAt() == null) {
            review.setSubmittedAt(LocalDateTime.now());
        }
        return repository.save(review);
    }
}