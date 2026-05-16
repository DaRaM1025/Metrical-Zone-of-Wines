package co.edu.unbosque.wines.controller;

import co.edu.unbosque.wines.document.VineyardReview;
import co.edu.unbosque.wines.service.mongo.VineyardReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vineyard-reviews")
@RequiredArgsConstructor
public class VineyardReviewController {
    private final VineyardReviewService service;

    @GetMapping
    public ResponseEntity<List<VineyardReview>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/vineyard/{vineyardId}")
    public ResponseEntity<List<VineyardReview>> getByVineyardId(@PathVariable Integer vineyardId) {
        return ResponseEntity.ok(service.findByVineyardId(vineyardId));
    }

    @PostMapping
    public ResponseEntity<VineyardReview> create(@RequestBody VineyardReview review) {
        return new ResponseEntity<>(service.save(review), HttpStatus.CREATED);
    }
}