package co.edu.unbosque.wines.service.mongo;

import co.edu.unbosque.wines.document.WineReview;
import co.edu.unbosque.wines.repository.mongo.WineReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WineReviewService {
    private final WineReviewRepository repository;

    public List<WineReview> findAll() {
        return repository.findAll();
    }

    public List<WineReview> findByWineId(Integer wineId) {
        return repository.findByWineId(wineId);
    }

    public WineReview save(WineReview review) {
        if (review.getSubmittedAt() == null) {
            review.setSubmittedAt(LocalDateTime.now());
        }
        return repository.save(review);
    }
}